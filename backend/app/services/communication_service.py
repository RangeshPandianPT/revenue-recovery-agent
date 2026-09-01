import logging
import os
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

class CommunicationService:
    """
    Handles outbound communications (SMS, WhatsApp, Email) based on AI decisions.
    For the buildathon, this can connect to Twilio or standard webhooks.
    """
    def __init__(self):
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_from_number = os.getenv("TWILIO_FROM_NUMBER")
        self.is_configured = bool(self.twilio_account_sid and self.twilio_auth_token)

    async def send_sms(self, to_number: str, message: str) -> bool:
        """
        Sends a real SMS using Twilio API.
        If credentials are not set, it mocks the sending for the demo.
        """
        logger.info(f"Preparing to send SMS to {to_number}: '{message}'")
        
        if not self.is_configured:
            logger.warning("Twilio credentials not found. MOCKING SMS delivery for demo.")
            # In a real hackathon demo, you'd show this log in the UI as 'Mock Sent'
            return True

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"
        
        auth = (self.twilio_account_sid, self.twilio_auth_token)
        data = {
            "To": to_number,
            "From": self.twilio_from_number,
            "Body": message
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, auth=auth, data=data)
                response.raise_for_status()
                logger.info(f"SMS successfully dispatched to {to_number}")
                return True
        except Exception as e:
            logger.error(f"Failed to send SMS: {str(e)}")
            return False

    async def dispatch_intervention(self, strategy: str, phone: Optional[str] = None, link: Optional[str] = None):
        """
        High-level orchestrator for sending the intervention based on strategy type.
        """
        if not phone:
            logger.info("No phone provided for intervention, skipping notification.")
            return
            
        message = ""
        if strategy == "PAYMENT_LINK":
            message = f"RecoverAI: Your payment failed. Please use this secure link to retry and keep your service active: {link or 'https://recoverai.demo.dev/pay/123'}"
        elif strategy == "REMINDER":
            message = f"RecoverAI Reminder: You have an outstanding balance. Please log in to your dashboard to resolve it."
        else:
            message = f"RecoverAI Notice: An action ({strategy}) has been taken on your account."
            
        await self.send_sms(to_number=phone, message=message)

communication_service = CommunicationService()
