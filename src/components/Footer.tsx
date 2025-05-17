import React from 'react';
import { Github, Code, Sparkles, Twitter, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Documentation', href: 'https://docs.forverse.ai' },
        { label: 'API Reference', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Community', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Privacy Policy', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-dark-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                AnimGenius
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transform your ideas into stunning mathematical visualizations using cutting-edge AI technology. Create beautiful animations effortlessly.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                className="p-2 bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-400 hover:text-primary-400" />
              </a>
              <a
                href="https://twitter.com"
                className="p-2 bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-400 hover:text-primary-400" />
              </a>
              <a
                href="mailto:contact@animgenius.ai"
                className="p-2 bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-gray-400 hover:text-primary-400" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AnimGenius. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Powered by</span>
              <a
                href="https://forverse.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
              >
                Forverse.ai
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;