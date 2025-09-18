from django.shortcuts import render
# yourapp/views.py
import hashlib, hmac
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
import jwt, datetime

def _verify_telegram_data(data_dict, received_hash, bot_token):
    """
    data_dict: dict of auth fields (strings) WITHOUT 'hash'
    received_hash: string (hex)
    bot_token: your bot token string
    returns: True if valid
    """
    # Build data_check_string
    items = []
    for k in sorted(data_dict.keys()):
        v = data_dict[k]
        items.append(f"{k}={v}")
    data_check_string = "\n".join(items)

    # Secret key is SHA-256 of bot token (binary)
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    hmac_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(hmac_hash, received_hash)

def telegram_auth_view(request):
    """
    Endpoint for Telegram widget (data-auth-url).
    Telegram will redirect the user to this URL with GET params.
    """
    params = request.GET.dict()  # first value for each key
    received_hash = params.pop("hash", None)
    if not received_hash:
        return HttpResponseBadRequest("Missing hash")

    bot_token = settings.TELEGRAM_BOT_TOKEN
    if not _verify_telegram_data(params, received_hash, bot_token):
        return HttpResponseBadRequest("Invalid Telegram data (bad hash)")

    # Verified: create or get user
    tg_id = params.get("id")
    username = params.get("username") or f"tg_{tg_id}"
    first_name = params.get("first_name", "")
    photo_url = params.get("photo_url", "")

    User = get_user_model()
    user, created = User.objects.get_or_create(
        username=f"tg_{tg_id}",
        defaults={"first_name": first_name},
    )

    # Issue JWT (simple example)
    payload = {
        "user_id": user.id,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24),
        "iat": datetime.datetime.now(datetime.timezone.utc)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    # pyjwt >=2 returns str; older versions may return bytes

  # Return a tiny HTML page that stores token in localStorage and redirects frontend
    frontend = "https://memurahardcoded.pages.dev"
    safe_frontend = frontend.rstrip("/")
    html = f"""
    <!doctype html><html><head><meta charset="utf-8"></head>
    <body>
      <script>
        // store token then redirect to frontend main page
        try {{
          localStorage.setItem('token', '{token}');
        }} catch(e) {{ /* storage failed */ }}
        window.location.replace(f'{safe_frontend}/callback?token={token}');
      </script>
    </body></html>
    """
    return HttpResponse(html, content_type="text/html")
    
# small endpoint to check token & return user info
def me_view(request):
    auth = request.META.get("HTTP_AUTHORIZATION", "")
    if not auth.startswith("Bearer "):
        return JsonResponse({"detail": "Authentication credentials were not provided."}, status=401)
    token = auth.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return JsonResponse({"detail": "Token expired"}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({"detail": "Invalid token"}, status=401)

    User = get_user_model()
    try:
        user = User.objects.get(id=payload["user_id"])
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=404)

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
    })








