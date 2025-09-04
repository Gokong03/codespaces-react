import os
from playwright.sync_api import sync_playwright, Page, expect

def open_drawer_and_click(page: Page, link_name: str):
    """Helper to reliably open the drawer and click a link using its text."""
    drawer_panel = page.locator("#drawer .panel")

    if not drawer_panel.is_visible():
        page.get_by_role("button", name="Menu").click()

    expect(drawer_panel).to_be_visible()

    page.get_by_role("link", name=link_name).click()

def run_verification(page: Page):
    """
    This script verifies the core functionality of the Kasir app.
    1. Sets up initial data (Account, Stock).
    2. Performs a physical and a digital transaction.
    3. Takes screenshots of key pages (History, Rekap, Stok, Saldo) to verify results.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    file_path = os.path.join(base_dir, 'index.html')

    page.goto(f'file://{file_path}')
    page.evaluate("localStorage.clear()")
    page.reload()

    # --- PART 1: SETUP ---
    open_drawer_and_click(page, "⚙️ Pengaturan")

    # Expand the correct details section first
    settings_page = page.locator("#page-settings")
    settings_page.get_by_text("Pengaturan Saldo / Akun").click()

    # Add a new financial account (use scoped locator)
    settings_page.get_by_placeholder("Nama akun (mis: BRI)").fill("Kas")
    settings_page.get_by_placeholder("Saldo awal").fill("500000")
    settings_page.get_by_role("button", name="Tambah / Update").click()

    # Go to Stock page
    open_drawer_and_click(page, "🏷️ Stok Barang")

    # Add a new stock item (use scoped locator)
    stok_page = page.locator("#page-stok")
    stok_page.get_by_placeholder("KODE").fill("CHG01")
    stok_page.get_by_placeholder("Nama").fill("Charger Type-C")
    stok_page.get_by_placeholder("H.Beli").fill("25000")
    stok_page.get_by_placeholder("H.Jual").fill("40000")
    stok_page.get_by_placeholder("Stok Awal / Tambah").fill("10")
    stok_page.get_by_role("button", name="Tambah / Update").click()

    # --- PART 2: TRANSACTIONS ---
    page.locator('.bottomnav a[data-go="fisik"]').click()

    # Perform a sale
    page.get_by_placeholder("Scan / ketik kode").fill("CHG01")
    page.get_by_placeholder("Scan / ketik kode").press("Enter")
    expect(page.get_by_placeholder("Otomatis dari stok")).to_have_value("Charger Type-C")
    page.get_by_label("Qty").fill("2")
    page.get_by_role("button", name="Simpan Transaksi").click()

    # Go to Digital Transaction page
    page.locator('.bottomnav a[data-go="digital"]').click()

    # Perform a service transaction
    page.get_by_label("Jenis").select_option("tarik")
    page.get_by_placeholder("Keterangan (opsional)").fill("Tarik Tunai Budi")
    page.get_by_label("Jumlah Pokok").fill("100000")
    page.get_by_label("Fee / Biaya Admin").fill("2500")
    page.get_by_role("button", name="Simpan").click()

    # --- PART 3: VERIFICATION & SCREENSHOTS ---
    page.locator('.bottomnav a[data-go="history"]').click()
    expect(page.get_by_text("(jual) Charger Type-C (2x)")).to_be_visible()
    expect(page.get_by_text("(tarik) Tarik Tunai Budi")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/01-final-history.png")

    page.locator('.bottomnav a[data-go="rekap"]').click()
    expect(page.get_by_text("Total Omzet")).to_be_visible()
    expect(page.get_by_text("Rp 80.000")).to_be_visible()
    expect(page.get_by_text("Rp 32.500")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/02-final-rekap.png")

    open_drawer_and_click(page, "🏷️ Stok Barang")
    expect(page.get_by_role("cell", name="8")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/03-final-stok.png")

    open_drawer_and_click(page, "💼 Saldo Akun")
    expect(page.get_by_text("Rp 480.000")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/04-final-saldo.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Intercept and dismiss all dialogs automatically
        page.on("dialog", lambda dialog: dialog.dismiss())
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()
