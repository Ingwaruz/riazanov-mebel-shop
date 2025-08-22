import React from 'react';
import { motion } from 'framer-motion';
import './RegistrationProgress.scss';

const RegistrationProgress = ({ currentStep }) => {
    const steps = [
        { id: 'form', label: 'Данные', icon: '1' },
        { id: 'pin', label: 'Подтверждение', icon: '2' },
        { id: 'complete', label: 'Готово', icon: '✓' }
    ];

    const getStepStatus = (stepId) => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        const stepIndex = steps.findIndex(s => s.id === stepId);
        
        if (stepIndex < currentIndex || (currentStep === 'complete' && stepId === 'complete')) {
            return 'completed';
        } else if (stepIndex === currentIndex) {
            return 'active';
        }
        return 'pending';
    };

    return (
        <div className="registration-progress">
            {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isLast = index === steps.length - 1;
                
                return (
                    <React.Fragment key={step.id}>
                        <div className={`registration-progress__step registration-progress__step--${status}`}>
                            <motion.div 
                                className="registration-progress__circle"
                                initial={{ scale: 0.8 }}
                                animate={{ 
                                    scale: status === 'active' ? 1.1 : 1,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {status === 'completed' ? '✓' : step.icon}
                            </motion.div>
                            <span className="registration-progress__label">{step.label}</span>
                        </div>
                        
                        {!isLast && (
                            <div className={`registration-progress__line registration-progress__line--${
                                status === 'completed' ? 'completed' : 'pending'
                            }`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default RegistrationProgress; 