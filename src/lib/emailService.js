import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends a volunteer notification email using EmailJS.
 * @param {Object} volunteer - The registered volunteer details (name, email, phone, role, message)
 */
export const sendVolunteerNotification = async (volunteer) => {
  try {
    if (!serviceId || !templateId || !publicKey) {
      console.warn("EmailJS credentials missing from environment variables!");
      return null;
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
