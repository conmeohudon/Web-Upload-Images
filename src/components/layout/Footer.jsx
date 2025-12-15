function Footer() {
  return (
    <footer className="fixed bottom-0 left-16 lg:left-64 right-0 bg-white border-t border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
          <span>©</span>
          <span>2025 Web Upload Images. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Help
          </a>
          <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </a>
          <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;