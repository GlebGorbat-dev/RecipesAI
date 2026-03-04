import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

async def send_email(to_email: str, subject: str, html_body: str, text_body: str = None):

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        return False

    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email

        if text_body:
            text_part = MIMEText(text_body, "plain", "utf-8")
            message.attach(text_part)

        html_part = MIMEText(html_body, "html", "utf-8")
        message.attach(html_part)

        if settings.SMTP_PORT == 465:
            ports_to_try = [(465, True)]
        elif settings.SMTP_PORT == 587:
            ports_to_try = [(465, True), (587, False)]
        else:
            use_tls = settings.SMTP_PORT == 465
            ports_to_try = [(settings.SMTP_PORT, use_tls)]

        last_error = None
        for port, use_tls in ports_to_try:
            smtp = None
            try:
                smtp = aiosmtplib.SMTP(
                    hostname=settings.SMTP_HOST,
                    port=port,
                    use_tls=use_tls,
                    timeout=20,  # Reduced timeout for faster fallback
                )

                # Connect to SMTP server
                await smtp.connect(timeout=20)

                # For port 587, start TLS after connection
                if port == 587 and not use_tls:
                    try:
                        await smtp.starttls(timeout=20)
                    except Exception as tls_error:
                        error_msg = str(tls_error).lower()
                        if "already using tls" not in error_msg and "already using ssl" not in error_msg:
                            raise

                # Authenticate
                await smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

                # Send email
                await smtp.send_message(message)

                # Success - close connection and return
                try:
                    if smtp.is_connected:
                        await smtp.quit()
                except Exception:
                    pass
                return True

            except Exception as e:
                last_error = e
                if smtp:
                    try:
                        if smtp.is_connected:
                            await smtp.quit()
                    except Exception:
                        pass
                continue

        raise last_error if last_error else Exception("All SMTP connection attempts failed")

    except Exception as e:
        error_str = str(e).lower()
        return False

def get_password_reset_email_html(reset_url: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #FF3B30;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Password Reset</h2>
            <p>You requested a password reset for your Recipes Online account.</p>
            <p>Click the button below to set a new password:</p>
            <a href="{reset_url}" class="button">Reset Password</a>
            <p>If the button does not work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">{reset_url}</p>
            <p>This link is valid for 1 hour.</p>
            <p>If you did not request a password reset, you can ignore this email.</p>
            <div class="footer">
                <p>Best regards,<br>Recipes Online Team</p>
            </div>
        </div>
    </body>
    </html>
    """

def get_password_reset_email_text(reset_url: str) -> str:
    return f"""
Password Reset

You requested a password reset for your Recipes Online account.

Follow this link to set a new password:
{reset_url}

This link is valid for 1 hour.

If you did not request a password reset, you can ignore this email.

Best regards,
Recipes Online Team
"""

