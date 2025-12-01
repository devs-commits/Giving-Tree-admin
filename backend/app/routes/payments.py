from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import Payments
from ..extensions import db, jwt

payments_bp = Blueprint('payments', __name__, url_prefix="/payments")


PAYSTACK_SECRET_KEY = "sk_test_84af6feb64e3d2a52369d14c6c2e3bff3f3b387a" # Replace with your key
PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize"
PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify/"

@payments_bp.route('/api/initialize-payment', methods=['POST'])
def initialize_payments():
    try:
        data = request.get_json()

        email = data.get('email')
        amount = data.get('amount')
        item_id = data.get('item_id')

        if not all([email, amount, item_id]):
            return jsonify({"status": False, "message": "Missing details"}), 400

        amount_kobo = int(float(amount) * 100)

        # 2. Add metadata to the payload
        # You can add as many custom fields here as you need
        payload = {
            "email": email,
            "amount": amount_kobo,
            "callback_url": "http://127.0.0.1:5000/payment_callback",
            "metadata": {
                "item_id": item_id,
                "custom_notes": "Purchasing specific item"
            }
        }

        headers = {
            "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }


        response = request.post(PAYSTACK_INIT_URL, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code == 200 and response_data['status']:
            return jsonify({
                "status": True, 
                "auth_url": response_data['data']['authorization_url'],
                "reference": response_data['data']['reference']
            })
        else:
            return jsonify({"status": False, "message": "Init failed"}), 400

    except Exception as e:
        return jsonify({"status": False, "message": str(e)}), 500
    

@payments_bp.route('/payment_callback', methods=['GET'])
def payment_callback():
    reference = request.args.get('reference')
    if not reference:
        return "No reference", 400

    # Verify transaction
    headers = {"Authorization": f"Bearer {PAYSTACK_SECRET_KEY}"}
    verify_response = requests.get(f"{PAYSTACK_VERIFY_URL}{reference}", headers=headers)
    verify_data = verify_response.json()

    if verify_data['status'] and verify_data['data']['status'] == 'success':
        # 3. Retrieve the item_id from metadata
        # Note: Paystack returns metadata inside the 'data' object
        metadata = verify_data['data']['metadata']
        paid_item_id = metadata.get('item_id')

        # 4. Logic to mark this specific item as paid in your DB
        # e.g., db.update_order(paid_item_id, status='paid')
        
        return f"Success! You paid for Item ID: {paid_item_id}"
    else:
        return "Payment Failed"