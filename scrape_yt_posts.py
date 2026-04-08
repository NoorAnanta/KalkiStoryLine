"""
Scrape YouTube Community Posts from @AdiParashaktiNoorAnanta
Saves text + screenshots to data/youtube-posts/
"""
import os
import time
import json
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'data', 'youtube-posts')
os.makedirs(OUTPUT_DIR, exist_ok=True)

CHANNEL_URL = "https://www.youtube.com/@AdiParashaktiNoorAnanta/posts"

def setup_driver():
    opts = Options()
    # opts.add_argument('--headless=new')  # Run visible so user can sign in if needed
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--window-size=1200,900')
    opts.add_argument('--disable-gpu')
    opts.add_argument('--lang=en')
    opts.add_argument('--mute-audio')
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=opts)
    return driver

def scroll_to_load(driver, scrolls=15, pause=3):
    """Scroll down to load more posts"""
    for i in range(scrolls):
        driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
        time.sleep(pause)
        print(f"  Scroll {i+1}/{scrolls}...")

def extract_posts(driver):
    """Extract community post data from loaded page"""
    posts = []

    # YouTube community posts are in ytd-backstage-post-thread-renderer
    post_elements = driver.find_elements(By.CSS_SELECTOR,
        'ytd-backstage-post-thread-renderer')

    if not post_elements:
        # Try alternative selectors
        post_elements = driver.find_elements(By.CSS_SELECTOR,
            'ytd-post-renderer')

    print(f"Found {len(post_elements)} post elements")

    for i, post_el in enumerate(post_elements):
        try:
            post_data = {'index': i + 1}

            # Get post text
            try:
                text_el = post_el.find_element(By.CSS_SELECTOR,
                    '#content-text, yt-formatted-string#content-text')
                post_data['text'] = text_el.text
            except:
                post_data['text'] = ''

            # Get date/time
            try:
                time_el = post_el.find_element(By.CSS_SELECTOR,
                    '#published-time-text a, yt-formatted-string#published-time-text')
                post_data['date'] = time_el.text
            except:
                post_data['date'] = ''

            # Get image URLs
            try:
                img_els = post_el.find_elements(By.CSS_SELECTOR,
                    'img.style-scope.ytd-backstage-image-renderer')
                post_data['images'] = [img.get_attribute('src') for img in img_els if img.get_attribute('src')]
            except:
                post_data['images'] = []

            # Get vote count
            try:
                vote_el = post_el.find_element(By.CSS_SELECTOR, '#vote-count-middle')
                post_data['votes'] = vote_el.text
            except:
                post_data['votes'] = ''

            # Take screenshot of the post
            try:
                screenshot_path = os.path.join(OUTPUT_DIR, f'post-{i+1:03d}.png')
                post_el.screenshot(screenshot_path)
                post_data['screenshot'] = f'post-{i+1:03d}.png'
            except Exception as e:
                post_data['screenshot'] = f'error: {str(e)}'

            if post_data['text'] or post_data['images']:
                posts.append(post_data)
                print(f"  Post {i+1}: {post_data['date']} - {post_data['text'][:80]}...")

        except Exception as e:
            print(f"  Error on post {i+1}: {e}")

    return posts

def main():
    print("=" * 60)
    print("YouTube Community Posts Scraper")
    print("=" * 60)
    print(f"Channel: {CHANNEL_URL}")
    print(f"Output: {OUTPUT_DIR}")

    print("\nStarting browser...")
    driver = setup_driver()

    try:
        print(f"Loading {CHANNEL_URL}...")
        driver.get(CHANNEL_URL)
        time.sleep(3)

        # Accept cookies if prompted
        try:
            consent = driver.find_elements(By.CSS_SELECTOR,
                'button[aria-label*="Accept"], tp-yt-paper-button[aria-label*="Accept"], button[aria-label*="accept"]')
            if consent:
                consent[0].click()
                time.sleep(2)
        except:
            pass

        # Give user time to sign in or accept cookies if needed
        print("\n>>> A Chrome window should have opened.")
        print(">>> If you see 'Sign in' or 'Community not available', sign in to YouTube.")
        print(">>> The script will wait 30 seconds for you to sign in if needed...")
        print(">>> If posts are already visible, just wait.\n")
        time.sleep(30)

        print("Scrolling to load posts...")
        scroll_to_load(driver, scrolls=20, pause=3)

        print("\nExtracting posts...")
        posts = extract_posts(driver)

        # Save full page screenshot
        driver.save_screenshot(os.path.join(OUTPUT_DIR, 'full-page.png'))

        # Save posts data as JSON
        json_path = os.path.join(OUTPUT_DIR, 'posts.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(posts, f, indent=2, ensure_ascii=False)

        # Save as text file too
        txt_path = os.path.join(OUTPUT_DIR, 'posts.txt')
        with open(txt_path, 'w', encoding='utf-8') as f:
            for post in posts:
                f.write(f"=== Post {post['index']} | {post['date']} ===\n")
                f.write(f"{post['text']}\n")
                if post['images']:
                    f.write(f"Images: {', '.join(post['images'])}\n")
                f.write(f"Votes: {post['votes']}\n")
                f.write(f"Screenshot: {post['screenshot']}\n")
                f.write("\n")

        print(f"\n{'=' * 60}")
        print(f"Done! Extracted {len(posts)} posts")
        print(f"Screenshots: {OUTPUT_DIR}/post-*.png")
        print(f"Data: {json_path}")
        print(f"Text: {txt_path}")
        print(f"{'=' * 60}")

    finally:
        driver.quit()

if __name__ == '__main__':
    main()
