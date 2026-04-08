# Kalki Maa Noor Ananta - Life Timeline Website

A beautiful, interactive timeline website showcasing the life events and divine messages of Kalki Maa Noor Ananta from 2016 to 2026.

## 📋 Overview

This is a **static website** that displays:
- **1,264+ life events** spanning 7+ years
- Beautiful image galleries from Instagram posts
- Chronological timeline view
- Category-based filtering
- Full-text search functionality
- Responsive design for all devices
- WordPress-ready integration

## 🌟 Features

- **Dual View Modes**: Switch between "All Events" and "Timeline" views
- **Year Navigation**: Quick jump to specific years
- **Search**: Find events by keywords, dates, or descriptions
- **Category Filters**: Filter by themes like predictions, messages, spiritual content
- **Image Modal**: Click any event to view full details
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Fast & Lightweight**: Pure HTML/CSS/JavaScript, no frameworks needed

## 📁 Project Structure

```
kalki-timeline-website/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All styling
├── js/
│   └── app.js              # All functionality
├── data/
│   └── timeline_data.json  # Generated event data
├── images/
│   └── KalkiMaaNoorAnantaLife-YYYY/  # Year folders with images
├── docs/
│   ├── WORDPRESS-GUIDE.md  # WordPress integration guide
│   └── UPDATE-GUIDE.md     # How to add new events
├── parse_data.py           # Python script to generate JSON from folders
└── README.md               # This file
```

## 🚀 Quick Start

### Option 1: View Locally

1. Open `index.html` in any modern web browser
2. That's it! The website works directly from files.

### Option 2: Run with Local Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

### Option 3: Upload to WordPress

See [WORDPRESS-GUIDE.md](docs/WORDPRESS-GUIDE.md) for detailed instructions.

## 📊 Adding New Events

### Automatic Method (Recommended)

1. Add new images and text files to the appropriate year folder:
   ```
   KalkiMaaNoorAnantaLife/KalkiMaaNoorAnantaLife-YYYY/
   ```

2. Follow the naming convention:
   ```
   YYYY-MM-DD-SN.jpg    (image file)
   YYYY-MM-DD-SN.txt    (description file)
   ```
   Where `SN` is the serial number (01, 02, 03, etc.)

3. Run the parser script:
   ```bash
   python parse_data.py /path/to/KalkiMaaNoorAnantaLife
   ```

4. The `data/timeline_data.json` file will be automatically updated

5. Copy the images folder to your website:
   ```bash
   cp -r KalkiMaaNoorAnantaLife images/
   ```

### Manual Method

Edit `data/timeline_data.json` directly and add event objects:

```json
{
  "id": "2026-04-07-01",
  "date": "2026-04-07",
  "year": 2026,
  "month": 4,
  "day": 7,
  "serial": "01",
  "image": "2026-04-07-01.jpg",
  "has_image": true,
  "text_file": "2026-04-07-01.txt",
  "description": "Event description here...",
  "keywords": ["message", "prediction", "spiritual"],
  "type": "event",
  "url": ""
}
```

## 🎨 Customization

### Colors

Edit `css/styles.css` and modify the CSS variables:

```css
:root {
    --primary-color: #8B5CF6;      /* Purple */
    --secondary-color: #EC4899;     /* Pink */
    --accent-color: #F59E0B;        /* Amber */
    /* ... more colors ... */
}
```

### Fonts

The website uses:
- **Playfair Display** (headings) - elegant serif
- **Inter** (body text) - modern sans-serif

Change them in the `<head>` of `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

### Layout

The grid layout automatically adjusts based on screen size. To change the card size, edit:

```css
.events-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    /* Change 320px to your preferred minimum card width */
}
```

## 🔧 Technical Details

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance

- **Initial Load**: < 1 second (with caching)
- **JSON Data**: ~200KB (for 1,264 events)
- **Images**: Lazy-loaded, cached by browser
- **No External Dependencies**: Pure vanilla JavaScript

### Data Structure

The `timeline_data.json` file contains:

```json
{
  "title": "Timeline title",
  "subtitle": "Timeline subtitle",
  "years": {
    "2016": {
      "year": 2016,
      "event_count": 12,
      "events": [ /* array of event objects */ ]
    }
  },
  "all_events": [ /* flat array of all events */ ],
  "categories": [ /* unique keywords */ ],
  "stats": {
    "total_years": 7,
    "total_events": 1264,
    "years_covered": "2016-2022",
    "categories_count": 12
  }
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🔍 SEO Optimization

The website includes:
- Semantic HTML structure
- Meta descriptions
- Proper heading hierarchy
- Alt text for images (automatically generated)
- Clean URLs (when hosted properly)

## 🌐 Hosting Options

### Static Hosting (Recommended)
- **Netlify**: Drag & drop deployment
- **Vercel**: GitHub integration
- **GitHub Pages**: Free hosting
- **AWS S3**: Scalable cloud storage

### Traditional Hosting
- Any web hosting with file upload
- WordPress (see integration guide)
- cPanel / FTP upload

## 📝 License

This project is created for documenting the life timeline of Kalki Maa Noor Ananta.
All content and images belong to their respective owners.

## 🙏 Credits

- **Content**: Kalki Maa Noor Ananta (@noorie_rai on Instagram)
- **Development**: Custom-built static website
- **Design**: Modern, responsive timeline interface
- **Fonts**: Google Fonts (Playfair Display, Inter)

## 📞 Support

For technical issues or questions:
1. Check the [WordPress Integration Guide](docs/WORDPRESS-GUIDE.md)
2. Check the [Update Guide](docs/UPDATE-GUIDE.md)
3. Review the code comments in `js/app.js` and `css/styles.css`

## 🔄 Version History

- **v1.0.0** (April 2026): Initial release
  - 1,264 events from 2016-2022
  - Dual view modes (All Events / Timeline)
  - Search and filter functionality
  - WordPress-ready integration
  - Fully responsive design

---

**Built with ❤️ to preserve and share divine messages for the next 8000 years**
