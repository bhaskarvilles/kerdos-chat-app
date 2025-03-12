import React, { useState } from 'react';
import { User } from '../types';
import { 
  SUBSCRIPTION_TIERS, 
  getRemainingMessages, 
  getTimeUntilReset, 
  formatTimeUntilReset 
} from '../services/subscriptionService';
import { upgradeToPremium } from '../services/subscriptionService';
import { updateUser } from '../services/userService';
import { CreditCard, Check, AlertCircle, Clock } from 'lucide-react';

interface SubscriptionInfoProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({ user, onUserUpdate }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPremium = user.subscription?.tier === 'premium';
  const remainingMessages = getRemainingMessages(user);
  const timeUntilReset = getTimeUntilReset(user);

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setError(null);
    setSuccess(null);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate payment info (simple validation for demo)
    if (paymentInfo.cardNumber.length < 16) {
      setError('Please enter a valid card number');
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      // Update user subscription
      const updatedUser = upgradeToPremium(user);
      onUserUpdate(updatedUser);
      
      // Show success message
      setSuccess('Subscription upgraded successfully!');
      setIsUpgrading(false);
      
      // Reset payment form
      setPaymentInfo({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
        <CreditCard className="mr-2" size={20} />
        Subscription Status
      </h2>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Current Plan:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
            isPremium 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {isPremium ? 'Premium' : 'Free'}
          </span>
        </div>
        
        {!isPremium && (
          <>
            <div className="flex items-center mb-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Messages Remaining:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {remainingMessages} of {SUBSCRIPTION_TIERS.free.messageLimit}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <Clock className="mr-2" size={16} />
              <span className="font-semibold text-gray-700 dark:text-gray-300">Reset in:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {formatTimeUntilReset(timeUntilReset)}
              </span>
            </div>
          </>
        )}
      </div>
      
      {!isPremium && !isUpgrading && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Upgrade to Premium</h3>
          <ul className="mb-4">
            {SUBSCRIPTION_TIERS.premium.features.map((feature, index) => (
              <li key={index} className="flex items-start mb-1">
                <Check className="mr-2 text-green-500 flex-shrink-0" size={16} />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">${SUBSCRIPTION_TIERS.premium.price}</span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
          </div>
          <button
            onClick={handleUpgrade}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Upgrade Now
          </button>
        </div>
      )}
      
      {isUpgrading && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Payment Information</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
              <AlertCircle className="mr-2" size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="cardName">
                Name on Card
              </label>
              <input
                id="cardName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="John Doe"
                value={paymentInfo.name}
                onChange={(e) => setPaymentInfo({...paymentInfo, name: e.target.value})}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="cardNumber">
                Card Number
              </label>
              <input
                id="cardNumber"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="1234 5678 9012 3456"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value.replace(/\D/g, '')})}
                maxLength={16}
                required
              />
            </div>
            
            <div className="flex mb-4">
              <div className="w-1/2 mr-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="expiryDate">
                  Expiry Date
                </label>
                <input
                  id="expiryDate"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                  required
                />
              </div>
              <div className="w-1/2 ml-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="cvv">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="123"
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Complete Payment
              </button>
              <button
                type="button"
                onClick={() => setIsUpgrading(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4 flex items-center">
          <Check className="mr-2" size={16} />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};

export default SubscriptionInfo; 