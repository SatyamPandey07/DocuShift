#!/bin/bash

# DocuShift Boot Script
# Color definitions for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0;0m' # No Color

clear
echo -e "${PURPLE}====================================================${NC}"
echo -e "${CYAN}             Welcome to DocuShift Converter          ${NC}"
echo -e "${PURPLE}====================================================${NC}"
echo -e "Starting up the server..."

# Check if python3 is available
if ! command -v python3 &> /dev/null
then
    echo -e "${RED}Error: python3 could not be found. Please install Python 3.${NC}"
    exit 1
fi

# Set working directory to script location
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Set up virtual environment if not present
if [ ! -d ".venv" ]; then
    echo -e "${BLUE}No virtual environment found. Setting up .venv...${NC}"
    python3 -m venv .venv
    
    echo -e "${BLUE}Installing dependencies...${NC}"
    source .venv/bin/activate
    pip3 install --upgrade pip
    pip3 install -r requirements.txt
else
    source .venv/bin/activate
fi

# Print local server access URL
echo -e "${GREEN}✓ Environment ready!${NC}"
echo -e "${CYAN}----------------------------------------------------${NC}"
echo -e "DocuShift is running locally."
echo -e "Access the web app here: ${GREEN}http://localhost:5001${NC}"
echo -e "${CYAN}----------------------------------------------------${NC}"
echo -e "Press [Ctrl+C] to stop the server."

# Start Flask
python3 app.py
