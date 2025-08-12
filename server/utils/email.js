const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to Great Wisdom Education',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Welcome to Great Wisdom Education!</h2>
        <p>Hello ${data.name},</p>
        <p>Welcome to our global educational platform! We're excited to have you join our community of learners and educators.</p>
        <p>As a ${data.role}, you now have access to:</p>
        <ul>
          <li>Browse and enroll in educational camps</li>
          <li>Connect with instructors and fellow students</li>
          <li>Access learning materials and resources</li>
          <li>Track your progress and achievements</li>
        </ul>
        <p>Get started by exploring our available camps and finding the perfect learning opportunity for you!</p>
        <p>Best regards,<br>The Great Wisdom Education Team</p>
      </div>
    `
  }),
  
  passwordReset: (data) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p><a href="${process.env.CLIENT_URL}/reset-password?token=${data.resetToken}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email. The link will expire in 1 hour.</p>
        <p>Best regards,<br>The Great Wisdom Education Team</p>
      </div>
    `
  }),
  
  emailVerification: (data) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Verify Your Email Address</h2>
        <p>Hello ${data.name},</p>
        <p>Please verify your email address by clicking the link below:</p>
        <p><a href="${process.env.CLIENT_URL}/verify-email?token=${data.verificationToken}" style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Great Wisdom Education Team</p>
      </div>
    `
  }),
  
  campEnrollment: (data) => ({
    subject: `Enrollment Confirmation - ${data.campTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Enrollment Confirmation</h2>
        <p>Hello ${data.studentName},</p>
        <p>Your enrollment in <strong>${data.campTitle}</strong> has been confirmed!</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Camp Details:</h3>
          <p><strong>Instructor:</strong> ${data.instructorName}</p>
          <p><strong>Start Date:</strong> ${data.startDate}</p>
          <p><strong>End Date:</strong> ${data.endDate}</p>
          <p><strong>Schedule:</strong> ${data.schedule}</p>
        </div>
        <p>You will receive further instructions and access to the camp materials before the start date.</p>
        <p>Best regards,<br>The Great Wisdom Education Team</p>
      </div>
    `
  }),
  
  campReminder: (data) => ({
    subject: `Reminder: ${data.campTitle} starts tomorrow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Camp Reminder</h2>
        <p>Hello ${data.studentName},</p>
        <p>This is a friendly reminder that <strong>${data.campTitle}</strong> starts tomorrow!</p>
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Important Information:</h3>
          <p><strong>First Session:</strong> ${data.firstSession}</p>
          <p><strong>Meeting Link:</strong> <a href="${data.meetingLink}">Join Session</a></p>
          <p><strong>Materials:</strong> Please review the pre-session materials in your dashboard.</p>
        </div>
        <p>We look forward to seeing you in class!</p>
        <p>Best regards,<br>The Great Wisdom Education Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    let emailContent;
    
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@greatwisdomeducation.com',
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail;