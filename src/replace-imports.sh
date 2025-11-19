#!/bin/bash

# Replace Button imports
find /components -name "*.tsx" -type f -exec sed -i "s|from './ui/button'|from './ui/button-simple'|g" {} \;
find /components -name "*.tsx" -type f -exec sed -i "s|from '../ui/button'|from '../ui/button-simple'|g" {} \;

# Replace Label imports
find /components -name "*.tsx" -type f -exec sed -i "s|from './ui/label'|from './ui/label-simple'|g" {} \;
find /components -name "*.tsx" -type f -exec sed -i "s|from '../ui/label'|from '../ui/label-simple'|g" {} \;

# Replace Dialog imports
find /components -name "*.tsx" -type f -exec sed -i "s|from './ui/dialog'|from './ui/dialog-simple'|g" {} \;
find /components -name "*.tsx" -type f -exec sed -i "s|from '../ui/dialog'|from '../ui/dialog-simple'|g" {} \;

# Replace Sheet imports
find /components -name "*.tsx" -type f -exec sed -i "s|from './ui/sheet'|from './ui/sheet-simple'|g" {} \;
find /components -name "*.tsx" -type f -exec sed -i "s|from '../ui/sheet'|from '../ui/sheet-simple'|g" {} \;

echo "All imports replaced!"
