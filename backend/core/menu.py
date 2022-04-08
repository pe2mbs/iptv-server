import webapp.api as API


API.menuItems = [
    { 'caption': 'Dashboard',
      'icon': 'dashboard',
      'route': '/dashboard'
    },
    { 'caption': 'Administration',
      'icon': 'settings',
      'children': []
    },
    { 'caption': 'Feedback',
      'icon': 'feedback',
      'route': '/feedback'
    }
]