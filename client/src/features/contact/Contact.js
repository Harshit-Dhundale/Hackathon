import React, { useState } from 'react';
import HeroHeader from '../../components/common/HeroHeader';
import { FiUser, FiMail, FiBook, FiMessageSquare, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import styles from './Contact.module.css';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`https://hackathon-backend-6c9z.onrender.com/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 201) {
        setFeedback('Thank you for reaching out! We will get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
        setShowModal(true); // Show the modal upon success
      } else {
        setFeedback(data.message || 'Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      setFeedback('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeroHeader
        title="Get in Touch"
        subtitle="We're here to help and answer any question you might have"
        backgroundImage="/assets/head/contact.jpg"
      />

      <main className={styles.contactContainer}>
        <div className={styles.contactGrid}>
          {/* Contact Form Section */}
          <div className={`${styles.contactCard} ${styles.formSection}`}>
            <h2 className={styles.sectionTitle}>
              <FiSend className={styles.icon} /> Send a Message
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <FiUser className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <FiMail className={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <FiBook className={styles.inputIcon} />
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <FiMessageSquare className={styles.inputIcon} />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className={styles.loading}>Sending...</span>
                ) : (
                  <>
                    <FiSend className={styles.btnIcon} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className={`${styles.contactCard} ${styles.infoSection}`}>
            <h2 className={styles.sectionTitle}>
              <FiMapPin className={styles.icon} /> Contact Information
            </h2>
            <div className={styles.infoItem}>
              <FiMail className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <h3>Email</h3>
                <p>support@MarketMitra.com</p>
                <p>sales@MarketMitra.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FiPhone className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>+1 (555) 890-1234</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FiMapPin className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <h3>Address</h3>
                <p>123 MarketMitra Lane</p>
                <p>Agricultural City, Country 12345</p>
              </div>
            </div>

            <div className={styles.mapEmbed}>
              <iframe
                title="MarketMitra Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2848386102783!2d73.85401672470779!3d18.51602606931403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa5b442ff%3A0x9df365f5b648bce1!2sShrimant%20Dagdusheth%20Halwai%20Ganpati%20Mandir!5e0!3m2!1sen!2sin!4v1741365070973!5m2!1sen!2sin"
                width="400"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      {/* Thank you Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Thank You!</h2>
            <p>{feedback}</p>
            <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}

      <footer className={styles.contactFooter}>
        <p>&copy; 2025 MarketMitra. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Contact;