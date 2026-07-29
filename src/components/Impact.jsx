import React, { useState, useEffect, useRef } from 'react';
import './Impact.css';

const AnimatedCounter = ({ value, isVisible }) => {
  const [count, setCount] = useState(0);

  const stringVal = String(value || '0');
  const numericString = stringVal.replace(/[^0-9]/g, '');
  const targetNumber = parseInt(numericString, 10) || 0;
  
  const suffixMatch = stringVal.match(/[^0-9,]+$/);
  const suffix = suffixMatch ? suffixMatch[0] : '';
  const hasComma = stringVal.includes(',');

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = targetNumber;
    if (start === end) {
      setCount(end);
      return;
    }

    const duration = 2000; // 2 seconds mein counter animation complete hogi — feel bahut smooth aati hai
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function use kar rahe hain — counter pehle tezi se chalega, phir dheere dheere slow hoga (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * (end - start) + start);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, targetNumber]);

  const formatNumber = (num) => {
    if (hasComma) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <>
      {formatNumber(count)}
      {suffix && <span className="text-gold">{suffix}</span>}
    </>
  );
};

const Impact = ({ impactStats }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Students Counselled', value: impactStats?.studentsCounselled || '1,000+', suffix: '' },
    { label: 'Youth Trained', value: impactStats?.youthTrained || '50+', suffix: '' },
    { label: 'Individuals Reached', value: impactStats?.individualsReached || '100+', suffix: '' },
    { label: 'Community Events', value: impactStats?.communityEvents || '10+', suffix: '' }
  ];

  return (
    <section id="impact" className="section impact" ref={sectionRef}>
      <div className="impact-overlay"></div>
      <div className="container impact-content">
        <div className="impact-header">
          <h4 className="subtitle text-gold">Measurable Change</h4>
          <h2 className="section-title text-white" style={{textAlign: 'left'}}>Our Impact So Far</h2>
          <p className="section-subtitle text-white-50" style={{textAlign: 'left', margin: '0 0 40px 0'}}>We believe in transparent, accountable, and lasting impact. Here is what we have achieved together with our partners and volunteers.</p>
          <button className="btn btn-glass">Download Annual Report</button>
        </div>
        
        <div className="stats-grid-elegant">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card-elegant glass-panel ${isVisible ? 'animate-up' : ''}`} style={{animationDelay: `${index * 0.1}s`}}>
              <h3 className="stat-value">
                <AnimatedCounter value={stat.value} isVisible={isVisible} />
                {stat.suffix && <span className="text-gold">{stat.suffix}</span>}
              </h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Impact;
