export function getNavRect() {
  const { statusBarHeight, system, windowWidth } = wx.getSystemInfoSync()
  const capsuleBar = {
    top: 8,
    width: 96,
    height: 32,
    right: 8
  }

  try {
    const rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null
    if (!rect) {
      throw new Error('getMenuButtonBoundingClientRect Error')
    }
    if (!rect.width) {
      throw new Error('getMenuButtonBoundingClientRect Error')
    }
    capsuleBar.top = rect.top - statusBarHeight
    capsuleBar.width = rect.width
    capsuleBar.height = rect.height
    capsuleBar.right = windowWidth - rect.right
  } catch (e) {
    const ios = !!(system.toLowerCase().search('ios') + 1)
    if (ios) {
      capsuleBar.top = 4
      capsuleBar.width = 88
    }
  }

  const navBarHeight = capsuleBar.top * 2 + capsuleBar.height

  const height = statusBarHeight + navBarHeight

  return {
    height,
    capsuleBar,
    statusBarHeight,
    navBarHeight
  }
}
