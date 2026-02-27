import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // wait for client-side hydration
    await page.waitForLoadState('networkidle')
  })

  test('renders hero headline and tagline', async ({ page }) => {
    await expect(page.getByText('Knows before')).toBeVisible()
    await expect(page.getByText('you ask.')).toBeVisible()
    await expect(page.getByText(/AI SRE agent/)).toBeVisible()
  })

  test('shows "early access open" badge', async ({ page }) => {
    await expect(page.getByText('early access open')).toBeVisible()
  })

  test('waitlist form is present and accepts input', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitBtn = page.getByRole('button', { name: /join waitlist/i }).first()
    await expect(emailInput).toBeVisible()
    await expect(submitBtn).toBeVisible()
    await emailInput.fill('test@example.com')
    await expect(emailInput).toHaveValue('test@example.com')
  })

  test('terminal animation renders', async ({ page }) => {
    await expect(page.getByText('prescient — production')).toBeVisible()
  })

  test('how it works section has 4 steps', async ({ page }) => {
    await expect(page.getByText('Connect your stack')).toBeVisible()
    await expect(page.getByText('Baselines, automatically')).toBeVisible()
    await expect(page.getByText('Insight, not noise')).toBeVisible()
    await expect(page.getByText('Fixes, risk-gated')).toBeVisible()
  })

  test('safety invariant block is visible', async ({ page }) => {
    await page.getByText('safety invariant').scrollIntoViewIfNeeded()
    await expect(page.getByText('safety invariant')).toBeVisible()
    await expect(page.getByText(/requiresApproval: true/)).toBeVisible()
  })

  test('connector strip shows key tools', async ({ page }) => {
    // scroll to connector section
    await page.getByText('connects to your existing stack').scrollIntoViewIfNeeded()
    await expect(page.getByText('Prometheus').last()).toBeVisible()
    await expect(page.getByText('Datadog').last()).toBeVisible()
    await expect(page.getByText('K8s')).toBeVisible()
  })

  test('GitHub link points to correct repo', async ({ page }) => {
    const link = page.locator('a[href*="github.com/munindranath/prescient"]').first()
    await expect(link).toBeVisible()
  })

  test('nav shows prescient branding', async ({ page }) => {
    await expect(page.locator('nav').getByText('prescient')).toBeVisible()
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Prescient/)
  })
})
