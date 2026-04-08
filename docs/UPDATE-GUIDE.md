# Update Guide - Adding New Events

This guide explains how to add new life events to the timeline.

## 📋 Quick Reference

**File Naming Format:**
```
YYYY-MM-DD-SN.jpg    # Image file
YYYY-MM-DD-SN.txt    # Description file
```

**Example:**
```
2026-04-07-01.jpg
2026-04-07-01.txt
```

Where:
- `YYYY` = Year (2026)
- `MM` = Month (04 for April)
- `DD` = Day (07)
- `SN` = Serial number (01, 02, 03... for multiple events on same day)

---

## 🚀 Method 1: Automatic Update (Recommended)

### Step 1: Prepare Your Files

1. **Create/organize your image files**:
   ```
   2026-04-07-01.jpg
   2026-04-07-02.jpg
   2026-04-15-01.jpg
   ```

2. **Create corresponding text files**:
   ```
   2026-04-07-01.txt
   2026-04-07-02.txt
   2026-04-15-01.txt
   ```

### Step 2: Text File Format

Each `.txt` file should contain:

```
Image: 2026-04-07-01
[Description of the event goes here. This can be multiple paragraphs.

Include details about the message, its significance, predictions, or any
relevant context about this life event.]
```

**Example:**
```
Image: 2026-04-07-01
On this day, Maa Noor Ananta shared a profound message about unity 
and harmony. The image shows her message about bringing together different 
faiths and beliefs under one universal consciousness. This aligns with her 
ongoing mission to spread divine wisdom across the world.
```

### Step 3: Place Files in Year Folder

1. Navigate to your data folder:
   ```
   KalkiMaaNoorAnantaLife/
   ```

2. Create year folder if it doesn't exist:
   ```
   KalkiMaaNoorAnantaLife/KalkiMaaNoorAnantaLife-2026/
   ```

3. Copy your files into this folder:
   ```
   KalkiMaaNoorAnantaLife/
   └── KalkiMaaNoorAnantaLife-2026/
       ├── 2026-04-07-01.jpg
       ├── 2026-04-07-01.txt
       ├── 2026-04-07-02.jpg
       ├── 2026-04-07-02.txt
       ├── 2026-04-15-01.jpg
       └── 2026-04-15-01.txt
   ```

### Step 4: Run Parser Script

```bash
# Navigate to website directory
cd /path/to/kalki-timeline-website

# Run the parser
python parse_data.py /path/to/KalkiMaaNoorAnantaLife

# Output will show:
# ✓ Successfully parsed X events
# ✓ Spanning X years (2016-2026)
# ✓ Output saved to: data/timeline_data.json
```

### Step 5: Copy Images to Website

```bash
# Copy the entire images folder
cp -r /path/to/KalkiMaaNoorAnantaLife images/

# Or copy just the new year
cp -r /path/to/KalkiMaaNoorAnantaLife/KalkiMaaNoorAnantaLife-2026 images/
```

### Step 6: Upload to Website

1. Upload the updated `data/timeline_data.json`
2. Upload the new images folder
3. Done! The timeline will automatically show new events.

---

## 📝 Method 2: Manual JSON Update

If you can't run Python, you can edit the JSON directly.

### Step 1: Open JSON File

Open `data/timeline_data.json` in a text editor.

### Step 2: Add New Event

Find the year section and add your event:

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
  "description": "On this day, Maa Noor Ananta shared a profound message about unity and harmony...",
  "keywords": ["message", "unity", "spiritual"],
  "type": "event",
  "url": ""
}
```

### Step 3: Update Multiple Sections

You need to add the event in **3 places**:

1. **In years section**:
```json
"years": {
  "2026": {
    "year": 2026,
    "event_count": 1,  // Increment this
    "events": [
      // Add your event here
      {
        "id": "2026-04-07-01",
        // ... rest of event data
      }
    ]
  }
}
```

2. **In all_events array**:
```json
"all_events": [
  // Add your event here
  {
    "id": "2026-04-07-01",
    // ... rest of event data
  }
  // ... other events
]
```

3. **Update stats**:
```json
"stats": {
  "total_years": 8,  // Increment if new year
  "total_events": 1265,  // Increment by number of new events
  "years_covered": "2016-2026",  // Update end year
  "categories_count": 12
}
```

### Step 4: Validate JSON

- Use [JSONLint](https://jsonlint.com/) to check for errors
- Common mistakes:
  - Missing commas
  - Extra commas
  - Mismatched brackets `{}` or `[]`

---

## 🏷️ Adding Keywords/Categories

Keywords help with filtering and categorization.

### Automatic (in text files)

The parser automatically extracts keywords. To ensure certain keywords are found, use them in your description:

```
Image: 2026-04-07-01
This is a **prediction** about future events. Maa's **intuition** 
shows her **divine** connection to universal consciousness. This 
**message** is about world peace.
```

Common keywords extracted:
- prediction, prophecy
- message
- intuition
- divine, spiritual
- vision
- religion, god, faith
- future, past, present

### Manual (in JSON)

Add keywords directly:

```json
"keywords": [
  "prediction",
  "world peace",
  "divine message",
  "2026 prophecy"
]
```

**Tips:**
- Use lowercase
- Keep them short (1-3 words)
- Use specific terms
- Mix general and specific keywords

---

## 🖼️ Image Guidelines

### File Specifications

- **Format**: JPG, JPEG, or PNG
- **Size**: Recommended 800x800 to 1200x1200 pixels
- **File Size**: Under 500KB per image (optimize before upload)
- **Aspect Ratio**: Square (1:1) or standard Instagram (4:5)

### Image Optimization

**Using Online Tools:**
- [TinyPNG](https://tinypng.com/) - Free compression
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [ImageOptim](https://imageoptim.com/) - Mac app

**Using Command Line:**
```bash
# ImageMagick - resize and optimize
mogrify -quality 85 -resize 1200x1200\> *.jpg

# Keep original and create optimized version
convert original.jpg -quality 85 -resize 1200x1200 optimized.jpg
```

### Handling Missing Images

If an event has no image, the parser will handle it:

```json
{
  "image": "",
  "has_image": false
}
```

The website will display just the text without an image placeholder.

---

## 📅 Date Formats Supported

The parser supports multiple date formats:

### Standard Format (Recommended)
```
2026-04-07-01.jpg
YYYY-MM-DD-SN
```

### Alternative Formats
```
2026.04.07.01.jpg    # Dots instead of dashes
16-04-2026-01.jpg    # DD-MM-YYYY format (auto-detected for 2017 data)
```

**Note**: Stick to one format for consistency.

---

## 🔄 Update Workflow

### Regular Updates (Weekly/Monthly)

1. **Collect new content** throughout the week
2. **Organize files** following naming convention
3. **Place in year folder** with other events
4. **Run parser** on Friday/end of month
5. **Review JSON output** for accuracy
6. **Upload to website**
7. **Test** to ensure everything displays correctly
8. **Backup** the updated JSON

### Bulk Updates (Yearly)

For adding an entire year at once:

1. **Create year folder**
2. **Add all events** at once (100s of files)
3. **Run parser** - it handles large datasets
4. **Review output** for any skipped files
5. **Upload everything**
6. **Announce** the new year is available

---

## 🐛 Troubleshooting

### Parser Skips Files

**Problem**: Parser says "Skipping unrecognized filename"

**Solution**:
- Check filename format matches: `YYYY-MM-DD-SN.ext`
- No spaces in filename
- No special characters
- Date must be valid (e.g., not 2026-13-45)

### Wrong Date Displayed

**Problem**: Event shows wrong date

**Solution**:
- Check filename date is correct
- Ensure YYYY is a 4-digit year
- MM should be 01-12
- DD should be 01-31
- Re-run parser after fixing

### Images Not Loading on Website

**Problem**: Image broken icon shown

**Solution**:
1. Check image is in correct folder:
   ```
   images/KalkiMaaNoorAnantaLife-2026/2026-04-07-01.jpg
   ```
2. Check filename matches JSON exactly
3. Check file permissions (644)
4. Check image file isn't corrupted
5. Try uploading image again

### JSON Validation Error

**Problem**: JSON file won't load

**Solution**:
1. Copy JSON content
2. Paste into [JSONLint](https://jsonlint.com/)
3. Fix reported errors (usually commas or brackets)
4. Re-save and upload

---

## 📊 Statistics After Update

After running the parser, check stats:

```
✓ Successfully parsed 1300 events
✓ Spanning 8 years (2016-2026)
✓ Found 15 categories
✓ Output saved to: data/timeline_data.json

Year-by-year breakdown:
  2016: 12 events
  2017: 206 events
  2018: 13 events
  2019: 101 events
  2020: 155 events
  2021: 226 events
  2022: 551 events
  2026: 36 events  ← New!
```

This confirms:
- Total events increased
- New year was added
- Year breakdown is correct

---

## ✅ Pre-Upload Checklist

Before uploading updated files:

- [ ] All new images are named correctly
- [ ] All text files have descriptions
- [ ] Parser ran successfully
- [ ] JSON file generated without errors
- [ ] Tested locally (opened index.html)
- [ ] Images display correctly
- [ ] Search finds new events
- [ ] Year navigation includes new year
- [ ] Stats updated correctly
- [ ] Backed up previous version
- [ ] Ready to upload!

---

## 🎯 Best Practices

1. **Consistent Naming**: Always use the same date format
2. **Descriptive Text**: Write meaningful descriptions
3. **Optimize Images**: Don't upload huge files
4. **Regular Backups**: Keep copies of JSON and images
5. **Test Locally**: View changes before uploading
6. **Version Control**: Consider using Git for JSON
7. **Documentation**: Note any special events or changes

---

## 📁 Backup Strategy

### What to Backup

1. **JSON file**: `data/timeline_data.json`
2. **Images folder**: `images/`
3. **Original data**: `KalkiMaaNoorAnantaLife/` folder

### How Often

- **Before major updates**: Always
- **After adding new year**: Always
- **Monthly**: As routine
- **Before WordPress upload**: Always

### Where to Store

- External hard drive
- Cloud storage (Google Drive, Dropbox)
- Git repository (for JSON only)
- Multiple locations for redundancy

---

## 💡 Tips & Tricks

### Batch Renaming Files

If you have files without serial numbers:

```bash
# Linux/Mac
counter=1
for file in 2026-04-07-*.jpg; do
  mv "$file" "2026-04-07-$(printf "%02d" $counter).jpg"
  ((counter++))
done
```

### Creating Text Files Quickly

```bash
# Create text file with basic template
echo "Image: 2026-04-07-01
[Add description here]" > 2026-04-07-01.txt
```

### Checking for Missing Pairs

```bash
# List images without matching text files
for img in *.jpg; do
  txt="${img%.jpg}.txt"
  if [ ! -f "$txt" ]; then
    echo "Missing: $txt"
  fi
done
```

---

**Need Help?** Check the main README.md or WordPress guide for more details.
