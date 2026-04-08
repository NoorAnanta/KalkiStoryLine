#!/usr/bin/env python3
"""
Enhanced Parse KalkiMaaNoorAnanta Life Events Data
Features: Advanced text analysis, storyline connections, URL handling, sentiment analysis
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict, Counter
from urllib.parse import urlparse

# =====================================================
# Enhanced Keyword & Category Extraction
# =====================================================

# Comprehensive keyword categories
CATEGORY_PATTERNS = {
    # Spiritual & Divine
    'spiritual': r'\b(spiritual|divine|god|goddess|deity|sacred|holy|blessed|prayer|worship|devotion|soul|enlightenment)\b',
    'prophecy': r'\b(prophecy|prophecies|predict|prediction|predicted|foretell|foresee|foresaw|vision|premonition)\b',
    'intuition': r'\b(intuition|intuitive|sense|sensing|feeling|instinct|sixth sense|awareness|consciousness)\b',
    'message': r'\b(message|messages|messenger|communicate|communication|signal|sign|indication)\b',
    
    # Religious & Faith
    'religion': r'\b(religion|religious|faith|belief|believe|christian|muslim|hindu|buddhist|sikh|temple|mosque|church)\b',
    'meditation': r'\b(meditat|yoga|mindfulness|contemplation|inner peace|tranquility|serenity)\b',
    
    # Astrological & Mystical
    'astrology': r'\b(zodiac|horoscope|astrology|astrological|scorpio|aries|leo|planet|mercury|venus|mars)\b',
    'numerology': r'\b(number|numbers|numerical|digit|eight|eleven|sequence|pattern|code)\b',
    
    # Events & History
    'world_events': r'\b(world|global|international|universal|earth|planet|humanity|mankind|civilization)\b',
    'politics': r'\b(politics|political|government|president|prime minister|election|democracy|leader|modi|trump)\b',
    'economics': r'\b(economy|economic|money|finance|demonetization|currency|rupee|dollar|market|trade)\b',
    'pandemic': r'\b(pandemic|covid|corona|virus|disease|epidemic|outbreak|health crisis)\b',
    
    # India Specific
    'india': r'\b(india|indian|bharat|delhi|mumbai|hindi|sanskrit|vedic|ayurveda)\b',
    'demonetization': r'\b(demonetization|demonetisation|note ban|currency ban|500|1000|november 8)\b',
    
    # Time & Future
    'future': r'\b(future|tomorrow|ahead|coming|upcoming|next|will happen|going to)\b',
    'past': r'\b(past|history|historical|ancient|old|previous|before|ago)\b',
    'present': r'\b(today|now|present|current|currently|contemporary)\b',
    
    # Nature & Universe
    'universe': r'\b(universe|cosmic|cosmos|celestial|galaxy|star|constellation|space)\b',
    'nature': r'\b(nature|natural|earth|water|fire|air|element|environmental)\b',
    
    # Personal & Life
    'life': r'\b(life|living|alive|existence|being|birth|death|journey)\b',
    'wisdom': r'\b(wisdom|wise|knowledge|understanding|insight|enlightenment|truth)\b',
    'love': r'\b(love|compassion|kindness|empathy|heart|caring|affection)\b',
    'peace': r'\b(peace|peaceful|harmony|unity|together|oneness|balance)\b',
    
    # Symbols & Signs
    'symbolism': r'\b(symbol|symbolic|hidden|secret|code|cipher|meaning|interpret|decode)\b',
    'signs': r'\b(sign|signs|indication|signal|omen|portent|warning)\b',
}

# Theme patterns for deeper analysis
THEME_PATTERNS = {
    'prediction': r'\b(predict|will happen|going to|foresee|coming|ahead|future event)\b',
    'warning': r'\b(warn|warning|caution|careful|beware|danger|alert)\b',
    'celebration': r'\b(celebrat|happy|joy|festival|diwali|birthday|anniversary)\b',
    'unity': r'\b(unity|together|one|united|harmony|peace|equal)\b',
    'transformation': r'\b(transform|change|shift|revolution|new era|awakening)\b',
}

def extract_urls(text):
    """Extract and categorize URLs"""
    url_pattern = r'https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=]*)'
    urls = re.findall(url_pattern, text)
    
    parsed_urls = []
    for url in urls:
        parsed = urlparse(url)
        url_info = {
            'url': url,
            'domain': parsed.netloc,
            'type': 'unknown'
        }
        
        domain_lower = parsed.netloc.lower()
        if 'facebook' in domain_lower:
            url_info['type'] = 'facebook'
            url_info['label'] = 'Facebook Post'
        elif 'instagram' in domain_lower:
            url_info['type'] = 'instagram'
            url_info['label'] = 'Instagram Post'
        elif 'twitter' in domain_lower or 'x.com' in domain_lower:
            url_info['type'] = 'twitter'
            url_info['label'] = 'Twitter/X Post'
        elif 'youtube' in domain_lower or 'youtu.be' in domain_lower:
            url_info['type'] = 'youtube'
            url_info['label'] = 'YouTube Video'
        else:
            url_info['type'] = 'web'
            url_info['label'] = 'Web Link'
        
        parsed_urls.append(url_info)
    
    return parsed_urls

def extract_keywords_advanced(text):
    """Advanced keyword extraction with categorization"""
    text_lower = text.lower()
    keywords = set()
    categories = set()
    themes = set()
    
    # Extract categories
    for category, pattern in CATEGORY_PATTERNS.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            categories.add(category)
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            keywords.update([m.lower() for m in matches if len(m) > 3])
    
    # Extract themes
    for theme, pattern in THEME_PATTERNS.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            themes.add(theme)
    
    return {
        'keywords': list(keywords)[:15],
        'categories': sorted(list(categories)),
        'themes': sorted(list(themes)),
    }

def analyze_sentiment(text):
    """Simple sentiment analysis"""
    positive_words = r'\b(happy|joy|love|peace|beautiful|wonderful|blessed|divine|grace|light|positive|good|great|amazing)\b'
    negative_words = r'\b(sad|pain|war|conflict|danger|warning|crisis|problem|negative|bad|difficult|hard)\b'
    
    positive_count = len(re.findall(positive_words, text.lower()))
    negative_count = len(re.findall(negative_words, text.lower()))
    
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'concerning'
    else:
        return 'neutral'

def calculate_importance_score(text, keywords_data):
    """Calculate importance score based on content"""
    score = 0
    text_lower = text.lower()
    
    # Length factor
    word_count = len(text.split())
    if word_count > 100:
        score += 3
    elif word_count > 50:
        score += 2
    elif word_count > 20:
        score += 1
    
    # Category factor
    score += len(keywords_data['categories']) * 2
    
    # Theme factor
    score += len(keywords_data['themes']) * 3
    
    # Prediction/prophecy bonus
    if 'prophecy' in keywords_data['categories'] or 'prediction' in keywords_data['themes']:
        score += 5
    
    # Specific event mention bonus
    if re.search(r'\b(demonetization|pandemic|election|event|historical)\b', text_lower):
        score += 4
    
    return min(score, 20)  # Cap at 20

def parse_filename(filename):
    """Extract date and serial number from filename"""
    patterns = [
        r'(\d{4})-(\d{2})-(\d{2})-(\d+)',  # 2016-03-26-01
        r'(\d{4})\.(\d{2})\.(\d{2})\.(\d+)',  # 2016.01.01.01
        r'(\d{4})-(\d{2})-(\d{2})',  # 2016-03-26 (no serial)
        r'(\d{2})-(\d{2})-(\d{4})-(\d+)',  # 16-01-2017-56 (DD-MM-YYYY)
    ]
    
    for i, pattern in enumerate(patterns):
        match = re.match(pattern, filename)
        if match:
            groups = match.groups()
            
            if i == 3:  # DD-MM-YYYY format
                day, month, year = groups[0], groups[1], groups[2]
                serial = groups[3] if len(groups) > 3 else "00"
            else:
                year, month, day = groups[0], groups[1], groups[2]
                serial = groups[3] if len(groups) > 3 else "00"
            
            return {
                'year': int(year),
                'month': int(month),
                'day': int(day),
                'serial': serial,
                'date_str': f"{year}-{month}-{day}"
            }
    return None

def parse_text_file_enhanced(filepath):
    """Enhanced text file parsing"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read().strip()
        
        # Extract URLs first
        urls = extract_urls(content)
        
        # Remove URLs from text for analysis
        text_without_urls = re.sub(r'https?://\S+', '', content).strip()
        
        # Check if entire content is just a URL
        if content.startswith('http') and len(content.split()) == 1:
            return {
                'type': 'reference',
                'urls': urls,
                'description': f"Reference: {urls[0]['label'] if urls else 'External link'}",
                'has_content': False,
                'keywords': [],
                'categories': ['reference'],
                'themes': [],
                'sentiment': 'neutral',
                'importance': 1
            }
        
        # Extract image reference
        image_ref = None
        description = text_without_urls
        if content.startswith('Image:'):
            lines = content.split('\n', 1)
            image_ref = lines[0].replace('Image:', '').strip()
            description = lines[1].strip() if len(lines) > 1 else content
            description = re.sub(r'https?://\S+', '', description).strip()
        
        # Advanced keyword extraction
        keywords_data = extract_keywords_advanced(description)
        
        # Sentiment analysis
        sentiment = analyze_sentiment(description)
        
        # Calculate importance
        importance = calculate_importance_score(description, keywords_data)
        
        return {
            'type': 'event',
            'image_ref': image_ref,
            'description': description,
            'has_content': bool(description and len(description) > 10),
            'urls': urls,
            'keywords': keywords_data['keywords'],
            'categories': keywords_data['categories'],
            'themes': keywords_data['themes'],
            'sentiment': sentiment,
            'importance': importance
        }
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None

def parse_decoded_file(filepath):
    """Parse a .decoded file for enriched description and Yug Parivartan aspect"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read().strip()

        if not content:
            return None

        # Extract Yug Parivartan aspect if tagged
        parivartan_aspect = ''
        aspect_match = re.search(r'Aspect(?:\s+of\s+Yug\s+Parivartan)?:\s*(.+?)(?:\.|$)', content)
        if aspect_match:
            parivartan_aspect = aspect_match.group(1).strip()

        return {
            'decoded_description': content,
            'parivartan_aspect': parivartan_aspect,
        }
    except Exception as e:
        print(f"  Warning: Error reading decoded file {filepath}: {e}")
        return None


def parse_year_folder(year_path):
    """Parse all events in a year folder"""
    events = []
    files = os.listdir(year_path)
    event_groups = defaultdict(dict)

    for filename in files:
        filepath = os.path.join(year_path, filename)

        if os.path.isdir(filepath):
            continue

        file_info = parse_filename(filename)
        if not file_info:
            continue

        event_key = f"{file_info['date_str']}-{file_info['serial']}"

        if filename.endswith('.txt'):
            event_groups[event_key]['text_file'] = filename
            event_groups[event_key]['date_info'] = file_info
            event_groups[event_key]['text_path'] = filepath
        elif filename.endswith('.decoded'):
            event_groups[event_key]['decoded_path'] = filepath
        elif filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.jepg')):
            event_groups[event_key]['image_file'] = filename
            event_groups[event_key]['date_info'] = file_info

    for event_key, event_data in event_groups.items():
        if 'date_info' not in event_data:
            continue

        date_info = event_data['date_info']

        # Parse .txt file (primary source)
        text_data = None
        if 'text_path' in event_data:
            text_data = parse_text_file_enhanced(event_data['text_path'])

        # Parse .decoded file (enriched source)
        decoded_data = None
        if 'decoded_path' in event_data:
            decoded_data = parse_decoded_file(event_data['decoded_path'])

        # Build description: use .decoded if available and .txt is sparse
        description = text_data.get('description', '') if text_data else ''
        if decoded_data and decoded_data.get('decoded_description'):
            # If .txt has no real content or is just a URL, use decoded as primary
            if not text_data or not text_data.get('has_content', False):
                description = decoded_data['decoded_description']
            else:
                # Append decoded insights if .txt already has content
                description = description + '\n\n[Decoded from image] ' + decoded_data['decoded_description']

        # Re-analyze the combined description for better categories
        combined_text = description
        keywords_data = extract_keywords_advanced(combined_text)
        sentiment = analyze_sentiment(combined_text)
        importance = calculate_importance_score(combined_text, keywords_data)

        # If decoded file had original text_data, keep its URLs
        urls = text_data.get('urls', []) if text_data else []

        # Determine parivartan_aspect from decoded file
        parivartan_aspect = ''
        if decoded_data:
            parivartan_aspect = decoded_data.get('parivartan_aspect', '')

        event = {
            'id': event_key,
            'date': date_info['date_str'],
            'year': date_info['year'],
            'month': date_info['month'],
            'day': date_info['day'],
            'serial': date_info['serial'],
            'image': event_data.get('image_file', ''),
            'has_image': 'image_file' in event_data,
            'text_file': event_data.get('text_file', ''),
            'description': description,
            'has_content': bool(description and len(description) > 10),
            'keywords': keywords_data['keywords'],
            'categories': keywords_data['categories'],
            'themes': keywords_data['themes'],
            'sentiment': sentiment,
            'importance': importance,
            'urls': urls,
            'type': text_data.get('type', 'event') if text_data else 'event',
            'parivartan_aspect': parivartan_aspect,
            'has_decoded': decoded_data is not None,
        }

        events.append(event)

    events.sort(key=lambda x: (x['year'], x['month'], x['day'], x['serial']))
    return events

def create_narrative_summary(events):
    """Create storyline narrative"""
    if not events:
        return "No events to analyze."
    
    total = len(events)
    years = f"{events[0]['year']}-{events[-1]['year']}"
    
    prophecies = len([e for e in events if 'prophecy' in e['categories']])
    spiritual = len([e for e in events if 'spiritual' in e['categories']])
    
    return f"""Timeline of {total} events ({years}). 
Includes {prophecies} prophetic messages and {spiritual} spiritual insights.
Major themes: predictions of world events, spiritual consciousness, and divine messages."""

def parse_all_data(base_path):
    """Parse all data"""
    data = {
        'title': 'Kalki Maa Noor Ananta Life Timeline',
        'subtitle': 'A Chronicle of Divine Messages and World Events',
        'years': {},
        'all_events': [],
        'all_categories': set(),
        'category_counts': Counter(),
        'stats': {},
        'narrative_summary': ''
    }
    
    base_path_obj = Path(base_path)
    year_folders = sorted([d for d in base_path_obj.iterdir() 
                          if d.is_dir() and 'Life-20' in d.name])
    
    for year_folder in year_folders:
        year_match = re.search(r'20(\d{2})', year_folder.name)
        if not year_match:
            continue
        
        year = int(f"20{year_match.group(1)}")
        print(f"Processing year {year}...")
        
        events = parse_year_folder(year_folder)
        
        if events:
            year_categories = set()
            for event in events:
                year_categories.update(event['categories'])
                data['all_categories'].update(event['categories'])
                data['category_counts'].update(event['categories'])
            
            data['years'][year] = {
                'year': year,
                'event_count': len(events),
                'events': events,
                'categories': sorted(list(year_categories)),
            }
            
            data['all_events'].extend(events)
    
    data['all_categories'] = sorted(list(data['all_categories']))
    data['category_counts'] = dict(data['category_counts'].most_common())
    data['narrative_summary'] = create_narrative_summary(data['all_events'])
    
    high_importance = [e for e in data['all_events'] if e['importance'] >= 10]
    events_with_urls = [e for e in data['all_events'] if e['urls']]
    decoded_events = [e for e in data['all_events'] if e.get('has_decoded', False)]

    data['stats'] = {
        'total_years': len(data['years']),
        'total_events': len(data['all_events']),
        'years_covered': f"{min(data['years'].keys())}-{max(data['years'].keys())}",
        'total_categories': len(data['all_categories']),
        'high_importance_events': len(high_importance),
        'events_with_references': len(events_with_urls),
        'decoded_events': len(decoded_events),
        'top_categories': dict(list(data['category_counts'].items())[:10]),
    }
    
    return data

def main():
    """Main function"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python parse_data.py <path_to_KalkiMaaNoorAnantaLife_folder>")
        sys.exit(1)
    
    base_path = sys.argv[1]
    
    if not os.path.exists(base_path):
        print(f"Error: Path does not exist: {base_path}")
        sys.exit(1)
    
    print("=" * 60)
    print("ENHANCED TIMELINE PARSER")
    print("=" * 60)
    
    data = parse_all_data(base_path)
    
    output_file = 'data/timeline_data.json'
    os.makedirs('data', exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print("SUCCESS!")
    print("=" * 60)
    print(f"\n[Stats] Statistics:")
    print(f"  • Events: {data['stats']['total_events']}")
    print(f"  • Years: {data['stats']['years_covered']}")
    print(f"  • Categories: {data['stats']['total_categories']}")
    print(f"  • High-Importance: {data['stats']['high_importance_events']}")
    print(f"  • With References: {data['stats']['events_with_references']}")
    print(f"  • With Decoded Images: {data['stats']['decoded_events']}")
    
    print(f"\n[Categories]  Top Categories:")
    for cat, count in list(data['stats']['top_categories'].items())[:5]:
        print(f"  • {cat}: {count}")
    
    print(f"\n[Narrative] Narrative Summary:")
    print(f"  {data['narrative_summary']}")
    
    print(f"\n[Saved] Saved to: {output_file}")
    print("=" * 60)

if __name__ == '__main__':
    main()
