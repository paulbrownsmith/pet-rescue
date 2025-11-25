import React from 'react';
import { Box } from '@mui/material';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: 'background.paper' }}>
      <div className="bottom-footer wrap">
        <div className="bottom-footer__left">
          <img src="https://static.crumb.pet/build/0.3.164/static/images/crumb-logo-black.png" alt="logo" height={'30px'} />
          <div>
            <a href="https://facebook.com/crumb.pet" target="_blank" rel="noreferrer">
              <img src="https://static.crumb.pet/build/0.3.164/static/images/facebook-icon.webp" alt="facebook" />
            </a>
            <a href="https://www.instagram.com/crumb_pet" target="_blank" rel="noreferrer">
              <img src="https://static.crumb.pet/build/0.3.164/static/images/instagram-icon.webp" alt="instagram" />
            </a>
            <a href="https://twitter.com/crumb_pet" target="_blank" rel="noreferrer">
              <img src="https://static.crumb.pet/build/0.3.164/static/images/twitter-icon.webp" alt="twitter" />
            </a>
            <a href="https://tiktok.com/@crumbpet" target="_blank" rel="noreferrer">
              <img src="https://static.crumb.pet/build/0.3.164/static/images/tiktok-icon.webp" alt="tiktok" />
            </a>
          </div>
        </div>
        <div className="bottom-footer__right">
          <div className="bottom-footer__right__item">
            <p>Products</p>
            <a href="/en/order">Tag</a>
            <a href="/en/vet">Crumb Vet</a>
          </div>
          <div className="bottom-footer__right__item">
            <p>Legal</p>
            <a href="/en/terms">Terms</a>
            <a href="/en/privacy">Privacy</a>
          </div>
          <div className="bottom-footer__right__item">
            <p>Help</p>
            <a href="https://help.crumb.pet">Help centre</a>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Footer;
