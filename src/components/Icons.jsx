import {
  Menu,
  Search,
  Sun,
  Moon,
  X,
  Download,
  Check,
  BookOpen,
  Settings,
  Info,
  Filter,
  Trash2,
  CloudOff,
  ChevronRight,
  ArrowLeft,
  Share, // <-- ADD THIS LINE
  Share2
} from 'lucide-preact';

const defaultProps = {
  class: "w-5 h-5", // Use a consistent size
  strokeWidth: 2,
};

export const Icons = {
  Menu: (props) => <Menu {...defaultProps} {...props} />,
  Search: (props) => <Search {...defaultProps} {...props} />,
  Sun: (props) => <Sun {...defaultProps} {...props} />,
  Moon: (props) => <Moon {...defaultProps} {...props} />,
  X: (props) => <X {...defaultProps} {...props} />,
  Download: (props) => <Download {...defaultProps} {...props} />,
  Check: (props) => <Check {...defaultProps} {...props} />,
  Book: (props) => <BookOpen {...defaultProps} {...props} />,
  Settings: (props) => <Settings {...defaultProps} {...props} />,
  Info: (props) => <Info {...defaultProps} {...props} />,
  Filter: (props) => <Filter {...defaultProps} {...props} />,
  Trash: (props) => <Trash2 {...defaultProps} {...props} />,
  CloudOff: (props) => <CloudOff {...defaultProps} {...props} />,
  ChevronRight: (props) => <ChevronRight {...defaultProps} {...props} />,
  ArrowLeft: (props) => <ArrowLeft {...defaultProps} {...props} />,
  Share: (props) => <Share2 {...defaultProps} {...props} />, // <-- AND ADD THIS LINE
};