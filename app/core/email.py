import logging
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(to_email: str, subject: str, html_body: str, text_body: str = None) -> bool:
    """Send email. Prefers Resend API (works on HF Spaces); falls back to SMTP."""
    # Resend API — работает на HF Spaces (HTTPS), SMTP порты заблокированы
    api_key = settings.RESEND_API_KEY
    if api_key:
        return await _send_via_resend(to_email, subject, html_body, text_body, api_key)

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("Email not sent: no SMTP or RESEND_API_KEY configured")
        return False

    return await _send_via_smtp(to_email, subject, html_body, text_body)


async def _send_via_resend(to_email: str, subject: str, html_body: str, text_body: str, api_key: str) -> bool:
    try:
        import resend
        resend.api_key = api_key
        from_email = settings.SMTP_FROM_EMAIL or "onboarding@resend.dev"
        from_name = settings.SMTP_FROM_NAME or "Recipes Online"
        from_addr = f"{from_name} <{from_email}>"
        params = {
            "from": from_addr,
            "to": [to_email],
            "subject": subject,
            "html": html_body,
        }
        if text_body:
            params["text"] = text_body
        resend.Emails.send(params)
        logger.info("Email sent via Resend to %s", to_email)
        return True
    except Exception as e:
        logger.exception("Resend email failed: %s", e)
        return False


async def _send_via_smtp(to_email: str, subject: str, html_body: str, text_body: str) -> bool:
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        from_name = settings.SMTP_FROM_NAME or "Recipes"
        from_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
        message["From"] = f"{from_name} <{from_email}>"
        message["To"] = to_email

        if text_body:
            text_part = MIMEText(text_body, "plain", "utf-8")
            message.attach(text_part)

        html_part = MIMEText(html_body, "html", "utf-8")
        message.attach(html_part)

        port_val = int(settings.SMTP_PORT) if settings.SMTP_PORT else 587
        if port_val == 465:
            ports_to_try = [(465, True)]
        elif port_val == 587:
            ports_to_try = [(587, False)]
        else:
            ports_to_try = [(port_val, port_val == 465)]

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
        logger.exception("SMTP email failed: %s", e)
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

