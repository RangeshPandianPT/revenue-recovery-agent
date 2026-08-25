import os
import time
import uuid
import razorpay
from typing import Dict, Any, Optional

class RazorpayService:
    def __init__(self):
        self.key_id = os.environ.get("RAZORPAY_KEY_ID")
        self.key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
        self.test_mode = os.environ.get("RAZORPAY_TEST_MODE", "true").lower() == "true"
        
        self.client = None
        if self.key_id and self.key_secret:
            self.client = razorpay.Client(auth=(self.key_id, self.key_secret))

    def _is_mock(self):
        return self.client is None or self.test_mode

    def lookup_payment(self, payment_id: str) -> Dict[str, Any]:
        """Lookup a payment by ID"""
        if self._is_mock():
            # Mock response for testing
            return {
                "id": payment_id,
                "entity": "payment",
                "amount": 10000,
                "currency": "INR",
                "status": "captured",
                "method": "upi",
                "description": "Mocked payment lookup",
                "created_at": int(time.time())
            }
        
        try:
            return self.client.payment.fetch(payment_id)
        except Exception as e:
            raise Exception(f"Failed to lookup payment: {str(e)}")

    def create_payment_link(
        self, 
        amount: int, 
        currency: str = "INR", 
        description: str = "Recovery Payment",
        customer: Optional[Dict[str, str]] = None,
        reference_id: str = None
    ) -> Dict[str, Any]:
        """Create a payment link for recovery"""
        if not reference_id:
            reference_id = f"REF_{uuid.uuid4().hex[:8].upper()}"
            
        payload = {
            "amount": amount, # in paise
            "currency": currency,
            "accept_partial": False,
            "description": description,
            "reference_id": reference_id,
            "reminder_enable": True,
            "notes": {
                "type": "recovery"
            }
        }
        
        if customer:
            payload["customer"] = {}
            if "name" in customer:
                payload["customer"]["name"] = customer["name"]
            if "email" in customer:
                payload["customer"]["email"] = customer["email"]
            if "contact" in customer:
                payload["customer"]["contact"] = customer["contact"]

        if self._is_mock():
            # Return a mock payment link
            link_id = f"plink_{uuid.uuid4().hex[:14]}"
            return {
                "id": link_id,
                "short_url": f"https://rzp.io/i/{link_id}",
                "status": "created",
                "amount": amount,
                "reference_id": reference_id
            }

        try:
            return self.client.payment_link.create(payload)
        except Exception as e:
            raise Exception(f"Failed to create payment link: {str(e)}")

    def verify_webhook_signature(self, body: str, signature: str, secret: str) -> bool:
        """Verify webhook signature from Razorpay"""
        if self._is_mock():
            return True
        try:
            self.client.utility.verify_webhook_signature(body, signature, secret)
            return True
        except Exception:
            return False

razorpay_service = RazorpayService()
