import { test, expect } from '@playwright/test'

async function openMenu(page, label, isMobile) {
  const trigger = page.getByRole('button', { name: label, exact: true })
  if (isMobile) {
    await trigger.tap()
  } else {
    // Desktop dropdowns open on pointer-enter; clicking would toggle them shut.
    await page.mouse.move(0, 250)
    await trigger.hover()
  }
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('menu')).toBeVisible()
}

for (const label of ['Games', 'Practice']) {
  for (const bearVisible of [false, true]) {
    test(`${label} stays above the hero with bear ${bearVisible ? 'visible' : 'hidden'}`, async ({ page, isMobile }) => {
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.goto('/')
      if (bearVisible) {
        const hero = page.locator('section').first()
        await hero.locator('[style*="campsite"]').click()
        await expect(hero.locator('[style*="mapbear"]')).toHaveCSS('opacity', '1')
      }
      await openMenu(page, label, isMobile)
      const items = page.getByRole('menuitem')
      for (const item of await items.all()) {
        // Hit-testing catches the reported bug: visible menu text can still be
        // underneath a transparent portion of a higher-stacked illustration.
        const covered = await item.evaluate((element) => {
          const rect = element.getBoundingClientRect()
          return [0.25, 0.5, 0.8].some((fraction) => {
            const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height * fraction)
            return hit !== element && !element.contains(hit)
          })
        })
        expect(covered, `${await item.textContent()} is covered by page artwork`).toBe(false)
      }
      const firstItem = items.first()
      const destination = await firstItem.getAttribute('href')
      if (isMobile) await firstItem.tap()
      else await firstItem.click()
      await expect(page).toHaveURL(new URL(destination, page.url()).href)
      await expect(page.getByRole('menu')).toHaveCount(0)
      expect(errors).toEqual([])
    })
  }
}

test('Escape and outside press still close the dropdown', async ({ page, isMobile }) => {
  await page.goto('/')
  await openMenu(page, 'Games', isMobile)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await openMenu(page, 'Games', isMobile)
  await page.locator('section').first().click({ position: { x: 5, y: 250 } })
  await expect(page.getByRole('menu')).toHaveCount(0)
})
