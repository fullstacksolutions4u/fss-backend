// utils/emailTemplates.js - Professional email templates
export const emailTemplates = {
  // Base template wrapper
  baseTemplate: (content, title = 'Full Stack Solutions') => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8fafc;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .email-header {
                background: linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #8b5cf6 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            
            .email-header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            
            .email-header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .email-body {
                padding: 40px 30px;
            }
            
            .email-footer {
                background-color: #f1f5f9;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            
            .email-footer p {
                color: #64748b;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%);
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            
            .button:hover {
                transform: translateY(-1px);
            }
            
            .info-card {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .info-row:last-child {
                margin-bottom: 0;
                border-bottom: none;
                padding-bottom: 0;
            }
            
            .info-label {
                font-weight: 600;
                color: #475569;
                min-width: 100px;
            }
            
            .info-value {
                color: #1e293b;
                word-break: break-word;
            }
            
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .status-new { background: #dbeafe; color: #1e40af; }
            .status-progress { background: #fef3c7; color: #92400e; }
            .status-completed { background: #d1fae5; color: #065f46; }
            .status-closed { background: #f3f4f6; color: #374151; }
            
            .highlight {
                background: linear-gradient(135deg, #0d9488, #06b6d4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 700;
            }
            
            .contact-info {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            
            .social-links {
                margin-top: 15px;
            }
            
            .social-links a {
                color: #0d9488;
                text-decoration: none;
                margin: 0 10px;
                font-size: 14px;
            }
            
            @media (max-width: 600px) {
                .email-body {
                    padding: 25px 20px;
                }
                
                .email-footer {
                    padding: 20px;
                }
                
                .info-row {
                    flex-direction: column;
                }
                
                .info-label {
                    margin-bottom: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            ${content}
        </div>
    </body>
    </html>
  `,

  // New enquiry notification for admin
  newEnquiryAdmin: (data) => {
    const content = `
      <div class="email-header">
          <h1>🆕 New Enquiry Received</h1>
          <p>A new customer enquiry requires your attention</p>
      </div>
      
      <div class="email-body">
          <p>Hello Admin,</p>
          <p>You have received a new enquiry for <strong class="highlight">${data.service}</strong>. Here are the details:</p>
          
          <div class="info-card">
              <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${data.name}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${data.email}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${data.phone}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Service:</span>
                  <span class="info-value">${data.service}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Subject:</span>
                  <span class="info-value">${data.subject}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Enquiry ID:</span>
                  <span class="info-value">#${data.enquiryId}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Received:</span>
                  <span class="info-value">${new Date(data.createdAt).toLocaleString()}</span>
              </div>
          </div>
          
          <div style="margin: 20px 0;">
              <strong>Message:</strong>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-top: 8px; font-style: italic;">
                  "${data.message}"
              </div>
          </div>
          
          <div style="text-align: center;">
              <a href="${data.dashboardUrl || '#'}" class="button">
                  🔍 View in Dashboard
              </a>
          </div>
          
          <div class="contact-info">
              <p><strong>Quick Actions:</strong></p>
              <p>Reply to this enquiry: <a href="mailto:${data.email}">${data.email}</a></p>
              <p>Call customer: <a href="tel:${data.phone}">${data.phone}</a></p>
          </div>
      </div>
      
      <div class="email-footer">
          <p>This is an automated notification from your FSS Admin Panel</p>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'New Enquiry - FSS Admin');
  },

  // Customer confirmation email
  customerConfirmation: (data) => {
    const content = `
      <div class="email-header">
          <h1>✅ Thank You for Contacting Us!</h1>
          <p>Your enquiry has been received successfully</p>
      </div>
      
      <div class="email-body">
          <p>Dear <strong class="highlight">${data.name}</strong>,</p>
          
          <p>Thank you for choosing Full Stack Solutions! We have successfully received your enquiry for <strong>${data.service}</strong> and our team will review it shortly.</p>
          
          <div class="info-card">
              <div class="info-row">
                  <span class="info-label">Enquiry ID:</span>
                  <span class="info-value">#${data.enquiryId}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Service:</span>
                  <span class="info-value">${data.service}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Status:</span>
                  <span class="status-badge status-new">New</span>
              </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #0369a1; margin-bottom: 15px;">🚀 What Happens Next?</h3>
              <ul style="list-style: none; padding: 0;">
                  <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                      <span style="position: absolute; left: 0; color: #0d9488;">1️⃣</span>
                      Our team will review your requirements within 24 hours
                  </li>
                  <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                      <span style="position: absolute; left: 0; color: #0d9488;">2️⃣</span>
                      We'll contact you to discuss your project in detail
                  </li>
                  <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                      <span style="position: absolute; left: 0; color: #0d9488;">3️⃣</span>
                      Receive a customized proposal for your needs
                  </li>
              </ul>
          </div>
          
          <div class="contact-info">
              <h4 style="color: #1e293b; margin-bottom: 15px;">📞 Need Immediate Assistance?</h4>
              <p><strong>Call us:</strong> <a href="tel:${data.supportPhone}">${data.supportPhone}</a></p>
              <p><strong>Email us:</strong> <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
              <p><em>Our team is available Mon-Fri, 9:00 AM - 6:00 PM IST</em></p>
          </div>
      </div>
      
      <div class="email-footer">
          <p>Thank you for choosing Full Stack Solutions!</p>
          <div class="social-links">
              <a href="#">Website</a> |
              <a href="#">LinkedIn</a> |
              <a href="#">Twitter</a>
          </div>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'Enquiry Confirmation - FSS');
  },

  // Status update notification
  statusUpdate: (data) => {
    const statusClasses = {
      'New': 'status-new',
      'In Progress': 'status-progress',
      'Completed': 'status-completed',
      'Closed': 'status-closed'
    };

    const content = `
      <div class="email-header">
          <h1>${data.statusEmoji} Enquiry Status Update</h1>
          <p>Your enquiry status has been updated</p>
      </div>
      
      <div class="email-body">
          <p>Dear <strong class="highlight">${data.name}</strong>,</p>
          
          <p>We wanted to update you on the status of your enquiry for <strong>${data.service}</strong>.</p>
          
          <div class="info-card">
              <div class="info-row">
                  <span class="info-label">Enquiry ID:</span>
                  <span class="info-value">#${data.enquiryId}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Service:</span>
                  <span class="info-value">${data.service}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Previous Status:</span>
                  <span class="status-badge ${statusClasses[data.oldStatus] || 'status-new'}">${data.oldStatus}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Current Status:</span>
                  <span class="status-badge ${statusClasses[data.newStatus] || 'status-new'}">${data.newStatus}</span>
              </div>
          </div>
          
          ${data.newStatus === 'Completed' ? `
          <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <h3 style="color: #065f46; margin-bottom: 10px;">🎉 Project Completed!</h3>
              <p style="color: #047857;">Your project has been successfully completed. Thank you for choosing Full Stack Solutions!</p>
          </div>
          ` : data.newStatus === 'In Progress' ? `
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <h3 style="color: #92400e; margin-bottom: 10px;">⏳ Work in Progress</h3>
              <p style="color: #b45309;">Our team is actively working on your project. We'll keep you updated on the progress.</p>
          </div>
          ` : ''}
          
          <div class="contact-info">
              <h4 style="color: #1e293b; margin-bottom: 15px;">📞 Questions or Concerns?</h4>
              <p><strong>Call us:</strong> <a href="tel:${data.supportPhone}">${data.supportPhone}</a></p>
              <p><strong>Email us:</strong> <a href="mailto:${data.supportEmail}">${data.supportEmail}</a></p>
          </div>
      </div>
      
      <div class="email-footer">
          <p>Thank you for choosing Full Stack Solutions!</p>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'Status Update - FSS');
  },

  // Follow-up reminder for admin
  followUpReminder: (data) => {
    const content = `
      <div class="email-header">
          <h1>🔔 Follow-up Reminder</h1>
          <p>${data.enquiries.length} enquir${data.enquiries.length === 1 ? 'y' : 'ies'} need${data.enquiries.length === 1 ? 's' : ''} attention</p>
      </div>
      
      <div class="email-body">
          <p>Hello Admin,</p>
          <p>The following enquir${data.enquiries.length === 1 ? 'y is' : 'ies are'} due for follow-up:</p>
          
          ${data.enquiries.map(enquiry => `
          <div class="info-card" style="margin-bottom: 20px;">
              <div class="info-row">
                  <span class="info-label">Customer:</span>
                  <span class="info-value"><strong>${enquiry.name}</strong></span>
              </div>
              <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${enquiry.email}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Service:</span>
                  <span class="info-value">${enquiry.service}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Follow-up Date:</span>
                  <span class="info-value">${new Date(enquiry.followUpDate).toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Days Overdue:</span>
                  <span class="info-value" style="color: #dc2626; font-weight: 600;">${enquiry.daysPast} day${enquiry.daysPast === 1 ? '' : 's'}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Enquiry ID:</span>
                  <span class="info-value">#${enquiry.id}</span>
              </div>
          </div>
          `).join('')}
          
          <div style="text-align: center;">
              <a href="${data.dashboardUrl || '#'}" class="button">
                  📊 Open Dashboard
              </a>
          </div>
      </div>
      
      <div class="email-footer">
          <p>This is an automated reminder from your FSS Admin Panel</p>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'Follow-up Reminder - FSS Admin');
  },

  // Admin welcome email
  adminWelcome: (data) => {
    const content = `
      <div class="email-header">
          <h1>🎉 Welcome to FSS Admin!</h1>
          <p>Your admin account has been created successfully</p>
      </div>
      
      <div class="email-body">
          <p>Hello <strong class="highlight">${data.name}</strong>,</p>
          
          <p>Welcome to the Full Stack Solutions admin panel! Your account has been set up with <strong>${data.role}</strong> privileges.</p>
          
          <div class="info-card">
              <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${data.name}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${data.email}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Role:</span>
                  <span class="info-value">${data.role}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">Temporary Password:</span>
                  <span class="info-value" style="font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px;">${data.temporaryPassword}</span>
              </div>
          </div>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #92400e; margin-bottom: 10px;">⚠️ Important Security Note</h4>
              <p style="color: #b45309; margin-bottom: 15px;">Please change your password immediately after your first login for security purposes.</p>
              <ul style="list-style: none; padding: 0; color: #b45309;">
                  <li style="margin: 5px 0;">• Use a strong, unique password</li>
                  <li style="margin: 5px 0;">• Enable two-factor authentication if available</li>
                  <li style="margin: 5px 0;">• Never share your login credentials</li>
              </ul>
          </div>
          
          <div style="text-align: center;">
              <a href="${data.loginUrl || '#'}" class="button">
                  🔐 Login to Admin Panel
              </a>
          </div>
          
          <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #0369a1; margin-bottom: 15px;">🚀 Getting Started</h4>
              <ul style="list-style: none; padding: 0;">
                  <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                      <span style="position: absolute; left: 0; color: #0d9488;">📊</span>
                      View dashboard analytics and reports
                  </li>
                  <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                      <span style="position: absolute; left: 0; color: #0d9488;">📝</span>
                      Manage customer enquiries and responses
                  </li>
                  <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                      <span style="position: absolute; left: 0; color: #0d9488;">⚙️</span>
                      Configure system settings and preferences
                  </li>
              </ul>
          </div>
      </div>
      
      <div class="email-footer">
          <p>If you have any questions, please contact the system administrator</p>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'Admin Welcome - FSS');
  },

  // Weekly report
  weeklyReport: (data) => {
    const content = `
      <div class="email-header">
          <h1>📊 Weekly Report</h1>
          <p>${data.weekStart} - ${data.weekEnd}</p>
      </div>
      
      <div class="email-body">
          <p>Hello Admin,</p>
          <p>Here's your weekly summary for Full Stack Solutions:</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
              <div class="info-card" style="text-align: center;">
                  <h3 style="color: #0d9488; font-size: 2.5em; margin-bottom: 10px;">${data.totalEnquiries || 0}</h3>
                  <p style="color: #475569; font-weight: 600;">Total Enquiries</p>
                  <p style="color: ${(data.enquiryGrowth || 0) >= 0 ? '#059669' : '#dc2626'}; font-size: 14px;">
                      ${(data.enquiryGrowth || 0) >= 0 ? '↗️' : '↘️'} ${Math.abs(data.enquiryGrowth || 0)}% from last week
                  </p>
              </div>
              
              <div class="info-card" style="text-align: center;">
                  <h3 style="color: #0d9488; font-size: 2.5em; margin-bottom: 10px;">${data.completedEnquiries || 0}</h3>
                  <p style="color: #475569; font-weight: 600;">Completed</p>
                  <p style="color: #6366f1; font-size: 14px;">
                      ${Math.round(((data.completedEnquiries || 0) / (data.totalEnquiries || 1)) * 100)}% completion rate
                  </p>
              </div>
              
              <div class="info-card" style="text-align: center;">
                  <h3 style="color: #0d9488; font-size: 2.5em; margin-bottom: 10px;">${data.responseTime || 0}h</h3>
                  <p style="color: #475569; font-weight: 600;">Avg Response Time</p>
                  <p style="color: ${(data.responseImprovement || 0) >= 0 ? '#dc2626' : '#059669'}; font-size: 14px;">
                      ${(data.responseImprovement || 0) >= 0 ? '↗️' : '↘️'} ${Math.abs(data.responseImprovement || 0)}h from last week
                  </p>
              </div>
          </div>
          
          <div class="info-card">
              <h4 style="color: #1e293b; margin-bottom: 15px;">📈 Service Breakdown</h4>
              ${(data.serviceBreakdown || []).map(service => `
                  <div style="margin-bottom: 15px;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                          <span style="font-weight: 600;">${service.name}</span>
                          <span>${service.count} enquiries</span>
                      </div>
                      <div style="background: #e2e8f0; border-radius: 4px; height: 8px;">
                          <div style="background: linear-gradient(135deg, #0d9488, #06b6d4); border-radius: 4px; height: 8px; width: ${(service.percentage || 0)}%;"></div>
                      </div>
                  </div>
              `).join('')}
          </div>
          
          <div class="info-card">
              <h4 style="color: #1e293b; margin-bottom: 15px;">🎯 Key Highlights</h4>
              <ul style="list-style: none; padding: 0;">
                  ${(data.highlights || []).map(highlight => `
                      <li style="margin: 10px 0; padding-left: 25px; position: relative;">
                          <span style="position: absolute; left: 0; color: #0d9488;">${highlight.icon || '•'}</span>
                          ${highlight.text}
                      </li>
                  `).join('')}
              </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
              <a href="${data.dashboardUrl || '#'}" class="button">
                  📊 View Full Dashboard
              </a>
          </div>
      </div>
      
      <div class="email-footer">
          <p>Generated automatically by FSS Admin Panel</p>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'Weekly Report - FSS');
  },

  // Custom message template
  customMessage: (data) => {
    const content = `
      <div class="email-header">
          <h1>💬 Message from FSS</h1>
          <p>Full Stack Solutions Team</p>
      </div>
      
      <div class="email-body">
          <div style="font-size: 16px; line-height: 1.7; color: #374151;">
              ${data.message.split('\n').map(paragraph => 
                  `<p style="margin-bottom: 16px;">${paragraph}</p>`
              ).join('')}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-style: italic;">
                  Best regards,<br>
                  <strong>${data.senderName || 'Full Stack Solutions Team'}</strong>
              </p>
          </div>
      </div>
      
      <div class="email-footer">
          <p>Full Stack Solutions - Your Technology Partner</p>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'Message from FSS');
  },

  // Test email template
  testEmail: (data) => {
    const content = `
      <div class="email-header">
          <h1>🧪 Email Service Test</h1>
          <p>Testing FSS email configuration</p>
      </div>
      
      <div class="email-body">
          <p>Congratulations! 🎉</p>
          <p>Your FSS email service is working perfectly. This test email confirms that:</p>
          
          <div class="info-card">
              <div class="info-row">
                  <span class="info-label">✅ SMTP Connection:</span>
                  <span class="info-value">Successful</span>
              </div>
              <div class="info-row">
                  <span class="info-label">✅ Email Templates:</span>
                  <span class="info-value">Loading Correctly</span>
              </div>
              <div class="info-row">
                  <span class="info-label">✅ Authentication:</span>
                  <span class="info-value">Working</span>
              </div>
              <div class="info-row">
                  <span class="info-label">🕐 Test Time:</span>
                  <span class="info-value">${new Date(data.testTime).toLocaleString()}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">🖥️ Node Version:</span>
                  <span class="info-value">${data.serverInfo.nodeVersion}</span>
              </div>
              <div class="info-row">
                  <span class="info-label">🌍 Environment:</span>
                  <span class="info-value">${data.serverInfo.env}</span>
              </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
              <h3 style="color: #065f46; margin-bottom: 10px;">🎯 All Systems Go!</h3>
              <p style="color: #047857;">Your email service is ready to send notifications to customers and admins.</p>
          </div>
      </div>
      
      <div class="email-footer">
          <p>FSS Email Service Test - Automated Message</p>
          <p>&copy; ${new Date().getFullYear()} Full Stack Solutions. All rights reserved.</p>
      </div>
    `;
    
    return emailTemplates.baseTemplate(content, 'Email Test - FSS');
  }
};