import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: '₹30',
    tokens: 10,
    icon: <Zap className="h-6 w-6" />,
    features: [
      '10 Animation Tokens',
      'HD Quality Exports',
      'Basic Support',
      'Gallery Access'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Pro',
    price: '₹80',
    tokens: 30,
    icon: <Crown className="h-6 w-6" />,
    popular: true,
    features: [
      '30 Animation Tokens',
      '4K Quality Exports',
      'Priority Support',
      'Source Code Access',
      'Commercial Usage'
    ],
    color: 'from-primary-500 to-primary-600'
  },
  {
    name: 'Enterprise',
    price: '₹200',
    tokens: 100,
    icon: <Rocket className="h-6 w-6" />,
    features: [
      '100 Animation Tokens',
      '4K Quality Exports',
      '24/7 Premium Support',
      'API Access',
      'Custom Branding',
      'Team Collaboration'
    ],
    color: 'from-secondary-500 to-secondary-600'
  }
];

const Pricing: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h1 
          className="text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Simple, Token-Based Pricing
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Start with 5 free tokens. Pay only for what you need.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`relative ${plan.popular ? 'md:-mt-8' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <span className="bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className={`card h-full ${plan.popular ? 'border-2 border-primary-500' : ''}`}>
              <div className="p-8">
                <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${plan.color} mb-4`}>
                  {plan.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/ pack</span>
                </div>

                <div className="text-lg font-semibold text-primary-400 mb-6">
                  {plan.tokens} Tokens
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <Check className="h-5 w-5 text-primary-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={`btn w-full ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-outline hover:bg-primary-900/20'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Free Trial for New Users
        </h2>
        <p className="text-gray-400 mb-8">
          Get 5 tokens free when you sign up. No credit card required.
        </p>
        <Link to="/login" className="btn btn-primary px-8">
          Start Free Trial
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            What is a token?
          </h3>
          <p className="text-gray-400">
            One token allows you to generate one animation. Tokens never expire.
          </p>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Need more tokens?
          </h3>
          <p className="text-gray-400">
            You can purchase additional token packs at any time.
          </p>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Enterprise needs?
          </h3>
          <p className="text-gray-400">
            Contact us for custom plans and volume discounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;