import logging
import time
from typing import Optional

from celery import shared_task

from services.email_service import email_service
from utils.template_renderer import template_renderer


@shared_task(queue="mail")
def send_signup_verification_email_task(language: str, to: str, code: str) -> Optional[str]:
    """
    Asynchronously send a verification email with a code.

    :param language: Language for the email template (e.g., 'en', 'zh')
    :param to: Recipient email address
    :param code: Verification code
    :return: Message indicating success or failure
    """
    if not email_service.is_initialized:
        logging.error("Email service is not initialized. Cannot send verification email.")
        return None

    logging.info(f"Starting to send signup verification email to {to}.")
    start_at = time.perf_counter()

    try:
        # Render the email content with the appropriate language template
        template_path = f"{language}/signup_verification_email_template.html"
        html_content = template_renderer.render(template_path, to=to, code=code)

        # Send the email
        email_subject = "FuniqAi Signup Verification Code"
        email_service.send(to=to, subject=email_subject, html=html_content)

        # Calculate latency
        latency = time.perf_counter() - start_at
        logging.info(f"Successfully sent verification email to {to}. Latency: {latency:.2f}s")
        return "Success"
    except Exception as e:
        logging.exception(f"Failed to send verification email to {to}. Error: {e!s}")
        return None
