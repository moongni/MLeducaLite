module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      width: {
      '260px':"16.25rem",
      "78px" :"4.875rem"
      },
      height: {
        "60px":"3.75rem",
        "50px":"3.125rem"
      },
      minHeight: {
        "78px": "4.875rem"
      },
      right: {
        '-260px':"-16.25rem"
      },
      left: {
        '260px':"16.25rem",
        "78px" :"4.875rem"
      },
      maxWidth: {
      '260px':"16.25rem",
      },
      maxHeigth: {
        '448px':"28rem",
      },
      flexGrow: {
        '2': 2
      }
    },
  },
  plugins: [],
}
