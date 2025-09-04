import os
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies ONLY the baseline navigation functionality.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    file_path = os.path.join(base_dir, 'index.html')

    page.goto(f'file://{file_path}')

    # 1. Verify initial page is "Fisik"
    expect(page.locator("#page-fisik")).to_be_visible()
    expect(page.locator("#page-digital")).not_to_be_visible()

    # 2. Test bottom nav
    page.locator('.bottomnav a[data-go="digital"]').click()
    expect(page.locator("#page-digital")).to_be_visible()
    expect(page.locator("#page-fisik")).not_to_be_visible()

    # 3. Test drawer nav
    page.get_by_role("button", name="Menu").click()
    expect(page.locator("#drawer .panel")).to_be_visible()
    page.locator('#drawer a[data-go="settings"]').click()
    expect(page.locator("#page-settings")).to_be_visible()
    expect(page.locator("#page-digital")).not_to_be_visible()

    print("SUCCESS: Baseline navigation test passed.")
    page.screenshot(path="jules-scratch/verification/baseline-success.png")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()
