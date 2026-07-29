import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Yeh function EmailJS ke through ek notification email bhejta hai jab bhi koi volunteer register karta hai.
 * @param {Object} volunteer - Volunteer ka poora detail object — naam, email, phone, role, aur message
 */
export const sendVolunteerNotification = async (volunteer) => {
  try {
    if (!serviceId || !templateId || !publicKey) {
      throw new Error("EmailJS credentials (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, or VITE_EMAILJS_PUBLIC_KEY) are missing from your environment variables!");
    }

    const templateParams = {
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      role: volunteer.role,
      message: volunteer.message || 'No custom message provided.'
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log("Notification email sent successfully via EmailJS:", response.status, response.text);
    return response;
  } catch (error) {
    console.error("Failed to send email notification via EmailJS:", error);
    throw error;
  }
};
