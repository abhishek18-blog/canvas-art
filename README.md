# 🎨 The Artisan's Canvas - Handmade Art Portfolio

A stunning, responsive web portfolio showcasing authentic handmade artworks. Built with modern web technologies to provide an exceptional user experience for browsing, exploring, and purchasing unique handcrafted art pieces.

![Artisan Canvas Logo](favicon.png)

---

## ✨ Features

- **Beautiful Hero Section** - Eye-catching landing page with featured art collection
- **Responsive Design** - Seamless experience across all devices (mobile, tablet, desktop)
- **Art Gallery** - Browse curated collections of handmade artworks
- **Product Showcase** - Featured products with detailed listings
- **Reviews System** - Customer testimonials and ratings
- **Sold Archive** - Display of previously sold masterpieces
- **Contact Section** - Easy way for customers to reach out
- **User Authentication** - Secure login system
- **Dark Mode Support** - Eye-friendly interface with customizable themes

---

## 📁 Project Structure

```
canvas-art/
├── index.html                 # Main landing page
├── favicon.png               # Website tab icon
├── data.json                 # Product and gallery data
├── add_toggles.py            # Toggle configuration utility
│
├── assets/                   # Static assets
│   ├── artisanbg.jpeg       # Hero section background
│   ├── insta.jpg/png        # Social media icons
│   ├── gmail.png            # Contact icons
│   ├── qrcode.png           # QR codes
│   └── link.png             # Link icons
│
├── css/                      # Stylesheets
│   ├── style.css            # Main styles
│
├── js/                       # JavaScript files
│   ├── ui.js                # UI interactions and components
│   ├── auth.js              # Authentication logic
│   └── payment.js           # Payment QR only
│
└── Art Collections/         # Organized art categories
    ├── mandala/             # Mandala art collection
    ├── warli/               # Warli art collection
    ├── lippan/              # Lippan art collection
    ├── embroidery/          # Embroidery pieces
    ├── bottleart/           # Bottle art creations
    ├── frames/              # Framed artworks
    ├── giftcards/           # Gift card designs
    └── misc/                # Miscellaneous creations
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend installation required - runs entirely in the browser

### Installation

1. **Clone the repository** (if using Git)
   ```bash
   git clone <repository-url>
   cd canvas-art
   ```

2. **Add Required Images**
   - Place `favicon.png` in the root directory
   - Place `artisanbg.jpeg` in the `assets/` folder

3. **Open in Browser**
   - Open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js
     npx http-server
     ```
   - Navigate to `http://localhost:8000`

---

## 💻 Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with Tailwind CSS
- **JavaScript (ES6+)** - Interactive features and functionality
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library
- **JSON** - Data storage and management

---

## 🎯 Key Sections

### 1. **Navigation Bar**
- Sticky navigation for easy access
- Links to Featured, Available Art, Sold Archive, Contact, Reviews, and Payment
- Login button for user authentication

### 2. **Hero Section**
- Compelling headline and call-to-action
- Featured artwork showcase
- "Shop Current Inventory" button

### 3. **Featured Products**
- Slider/carousel of showcase items
- Multiple art categories (Mandala, Warli, Lippan, Embroidery, etc.)

### 4. **Gallery**
- Browse available artworks
- Filter by category
- View detailed product information

### 5. **Reviews**
- Customer testimonials
- Star ratings
- Build trust with potential buyers

### 6. **Sold Archive**
- Display of completed sales
- Showcase successful pieces
- Build credibility and portfolio

### 7. **Contact**
- Contact form for inquiries

---

## 🎨 Art Collections

The portfolio features diverse handmade art categories:

- **Mandala** - Intricate circular designs
- **Warli** - Traditional tribal art
- **Lippan** - Mirror work and pottery
- **Embroidery** - Thread work creations
- **Bottle Art** - Recycled bottle paintings
- **Frames** - Decorated frames and wall art
- **Gift Cards** - Personalized gift designs
- **Misc** - Other creative pieces

---

## 🔧 Customization

### Updating Product Data
Edit `data.json` to add or modify products:
```json
{
  "products": [
    {
      "id": 1,
      "name": "Mandala Art",
      "category": "mandala",
      "price": 2500,
      "image": "mandala/piece1.jpg",
      "description": "Beautiful handmade mandala..."
    }
  ]
}
```

### Modifying Styles
- Global styles are in `css/style.css`
- Payment page styles in `css/payment.css`
- Tailwind CSS classes are used for responsive design

### Adding Features
- Modify `js/ui.js` for UI interactions
- Update `js/auth.js` for authentication
- Configure `js/payment.js` for payment processing

---

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Mobile** - 320px and up
- **Tablet** - 768px and up
- **Desktop** - 1024px and up
- **Large Screens** - 1280px and up

---

## 🔐 Security Features

- User authentication system
- Secure payment processing
- Data validation
- Protection against common web vulnerabilities

---

## 📊 Performance Optimizations

- Lazy loading for images
- Optimized CSS and JavaScript
- Fast page load times
- Smooth animations and transitions

---

## 🌐 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📝 File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Main website structure |
| `data.json` | Product and inventory data |
| `css/style.css` | Main styling and layout |
| `js/ui.js` | User interface interactions |
| `js/auth.js` | User authentication |
| `js/payment.js` | Payment processing |
| `add_toggles.py` | Configuration utility |

---

## 🎁 Special Features

✅ **Handcrafted Quality** - Showcase of authentic artworks  
✅ **User Reviews** - Build trust with customer testimonials  
✅ **Sold Archive** - Display successful creations  
✅ **Mobile Friendly** - Perfect experience on all devices  
✅ **Fast Loading** - Optimized performance  
✅ **Easy Navigation** - Intuitive user interface  
✅ **Social Media Integration** - Share and connect  
✅ **Contact System** - Direct customer communication  

---

## 📞 Contact & Support

For inquiries or support regarding this portfolio:
- Use the Contact section on the website
- Connect via social media links
- Check the feedback/reviews section

---

## 📄 License

This project is created for professional portfolio purposes. All artwork and content remain the property of The Artisan's Canvas and its creator.

---

## 🙏 Credits

**Created with ❤️ for handmade art enthusiasts**

- **Framework**: Tailwind CSS
- **Icons**: Lucide Icons
- **Design Philosophy**: Minimalist & Elegant

---

## 📈 Future Enhancements

- [ ] Blog section for art stories
- [ ] Advanced search and filtering
- [ ] User wishlists
- [ ] Email notifications
- [ ] Inventory management dashboard
- [ ] Social media integration
- [ ] Video gallery
- [ ] Customer order history

---

**Last Updated**: March 2026  
**Version**: 1.0  
**Status**: Production Ready ✅

---

*"Every brushstroke tells a story. Every creation is unique. Welcome to The Artisan's Canvas."*
