export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>
<body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; background: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #111827; padding: 20px; text-align: left; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Lux By Stylish</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 28px; border-radius: 0 0 8px 8px; box-shadow: 0 6px 18px rgba(17,24,39,0.06);">
    <p style="margin: 0 0 12px 0;">Hi,</p>
    <p style="margin: 0 0 16px 0;">Thanks for signing up. Use the code below to verify your email address.</p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="display:inline-block; padding: 14px 22px; font-size: 24px; font-weight: 700; letter-spacing: 6px; background:#ffffff; border-radius:8px; color:#0f172a; box-shadow: 0 4px 12px rgba(2,6,23,0.08);">{verificationCode}</span>
    </div>
    <p style="margin: 0 0 12px 0;">Enter this code on the verification page to complete your registration. The code expires in 15 minutes.</p>
    <p style="margin: 18px 0 0 0;">If you didn't request this, you can safely ignore this email.</p>
    <p style="margin: 20px 0 0 0;">Best regards,<br/>The Lux By Stylish Team</p>
  </div>
  <div style="text-align: center; margin-top: 16px; color: #6b7280; font-size: 13px;">
    <p style="margin: 0;">This is an automated message — please do not reply.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; background: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #111827; padding: 20px; text-align: left; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Lux By Stylish</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 28px; border-radius: 0 0 8px 8px; box-shadow: 0 6px 18px rgba(17,24,39,0.06);">
    <p style="margin: 0 0 12px 0;">Hello,</p>
    <p style="margin: 0 0 16px 0;">Your password has been successfully reset.</p>
    <div style="text-align: center; margin: 22px 0;">
      <div style="background-color: #10b981; color: #ffffff; width: 56px; height: 56px; line-height: 56px; border-radius: 50%; display: inline-block; font-size: 30px;">✓</div>
    </div>
    <p style="margin: 0 0 12px 0;">If you did not request this change, please contact our support team immediately.</p>
    <p style="margin: 18px 0 0 0;">For better security we recommend using a strong, unique password and enabling two-factor authentication if available.</p>
    <p style="margin: 20px 0 0 0;">Sincerely,<br/>The Lux By Stylish Team</p>
  </div>
  <div style="text-align: center; margin-top: 16px; color: #6b7280; font-size: 13px;">
    <p style="margin: 0;">This is an automated message — please do not reply.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; background: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #111827; padding: 20px; text-align: left; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Lux By Stylish</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 28px; border-radius: 0 0 8px 8px; box-shadow: 0 6px 18px rgba(17,24,39,0.06);">
    <p style="margin: 0 0 12px 0;">Hi,</p>
    <p style="margin: 0 0 16px 0;">We received a request to reset your password. Click the button below to continue. If you didn't request this, you can safely ignore this message.</p>
    <div style="text-align: center; margin: 22px 0;">
      <a href="{resetURL}" style="display:inline-block; background-color: #10b981; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
    </div>
    <p style="margin: 0 0 12px 0;">This link will expire in 1 hour for security reasons.</p>
    <p style="margin: 20px 0 0 0;">Thanks,<br/>The Lux By Stylish Team</p>
  </div>
  <div style="text-align: center; margin-top: 16px; color: #6b7280; font-size: 13px;">
    <p style="margin: 0;">This is an automated message — please do not reply.</p>
  </div>
</body>
</html>
`;

export const GOOD_BYE_EMAIL_TEMPLATE = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Closure Confirmation</title>
  </head>
  <body
    style="
      font-family:
        Inter,
        system-ui,
        -apple-system,
        &quot;Segoe UI&quot;,
        Roboto,
        &quot;Helvetica Neue&quot;,
        Arial,
        sans-serif;
      color: #111827;
      background: #ffffff;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <div
      style="
        background-color: #111827;
        padding: 20px;
        text-align: left;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: #ffffff; margin: 0; font-size: 20px">Lux By Stylish</h1>
    </div>
    <div
      style="
        background-color: #f8fafc;
        padding: 28px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 6px 18px rgba(17, 24, 39, 0.06);
      "
    >
      <p style="margin: 0 0 12px 0">Hi {username},</p>
      <p style="margin: 0 0 16px 0">
        This email confirms that your account has been closed and your data
        queued for deletion per your request.
      </p>
      <div style="text-align: center; margin: 22px 0">
        <div
          style="
            background-color: #111827;
            color: #ffffff;
            width: 56px;
            height: 56px;
            line-height: 56px;
            border-radius: 50%;
            display: inline-block;
            font-size: 30px;
          "
        >
          &#128075
        </div>
      </div>
      <p style="margin: 0 0 12px 0">
        We're sorry to see you go. If you have feedback you'd like to share,
        reply to this message and our team will read it.
      </p>
      <p style="margin: 18px 0 0 0">
        Wishing you all the best,<br />The Lux By Stylish Team
      </p>
    </div>
    <div
      style="
        text-align: center;
        margin-top: 16px;
        color: #6b7280;
        font-size: 13px;
      "
    >
      <p style="margin: 0">This is an automated confirmation message.</p>
    </div>
  </body>
</html>

`;

export const WELCOME_EMAIL_TEMPLATE = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Lux By Stylish</title>
  </head>
  <body style="font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; background: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #111827; padding: 20px; text-align: left; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Lux By Stylish</h1>
    </div>
    <div style="background-color: #f8fafc; padding: 28px; border-radius: 0 0 8px 8px; box-shadow: 0 6px 18px rgba(17,24,39,0.06);">
      <p style="margin: 0 0 12px 0;">Hi {username},</p>
      <p style="margin: 0 0 16px 0;">Welcome to Lux By Stylish — we're thrilled to have you as part of our community. Here are a few things to get you started:</p>

      <ul style="margin: 0 0 16px 20px; padding: 0; color:#374151;">
        <li style="margin-bottom:8px;">Curated collections updated weekly to match trends.</li>
        <li style="margin-bottom:8px;">Free returns and fast shipping on qualifying orders.</li>
      </ul>

      <p style="margin: 0 0 12px 0;">If you have any questions or need recommendations, reply to this email — our team is happy to help.</p>
      <p style="margin: 20px 0 0 0;">Warmly,<br/>The Lux By Stylish Team</p>
    </div>
    <div style="text-align: center; margin-top: 16px; color: #6b7280; font-size: 13px;">
      <p style="margin: 0;">This is an automated message — please do not reply.</p>
    </div>
  </body>
  </html>
  `;
