import os
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies ONLY the Account Settings functionality.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    file_path = os.path.join(base_dir, 'index.html')

    page.goto(f'file://{file_path}')
    page.evaluate("localStorage.clear()")
    page.reload()

    # --- Test Account Settings ---
    # Navigate to settings page via drawer
    page.get_by_role("button", name="Menu").click()
    expect(page.locator("#drawer .panel")).to_be_visible()
    page.locator('#drawer a[data-go="settings"]').click()

    # Expand the account settings details block
    settings_page = page.locator("#page-settings")
    settings_page.get_by_text("Pengaturan Saldo / Akun").click()

    # Add a new financial account
    settings_page.get_by_placeholder("Nama akun (mis: BRI)").fill("Kas")
    settings_page.get_by_placeholder("Saldo awal").fill("500000")
    settings_page.get_by_role("button", name="Tambah / Update").click()

    # Verify the account was added
    expect(settings_page.get_by_role("cell", name="Kas")).to_be_visible()
    expect(settings_page.get_by_text("Rp 500.000")).to_be_visible()

    print("SUCCESS: Account Settings test passed.")
    page.screenshot(path="jules-scratch/verification/account-settings-success.png")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("dialog", lambda dialog: dialog.dismiss())
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()
