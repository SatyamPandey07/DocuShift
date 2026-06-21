document.addEventListener('DOMContentLoaded', () => {
    /* ===== Theme Toggle ===== */
    const toggleSwitch = document.querySelector('#theme-checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.className = currentTheme;
        if (currentTheme === 'light-theme') {
            toggleSwitch.checked = true;
        }
    }

    toggleSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            document.documentElement.className = 'light-theme';
            localStorage.setItem('theme', 'light-theme');
        } else {
            document.documentElement.className = 'dark-theme';
            localStorage.setItem('theme', 'dark-theme');
        }    
    });

    /* ===== Sidebar Tool Selection ===== */
    const menuItems = document.querySelectorAll('.sidebar-nav .nav-link');
    const titleElement = document.getElementById('current-tool-title');
    const targetFormatElement = document.getElementById('target-format');
    
    // Default formats based on tool selection
    const toolFormats = {
        'pdf-to-word': 'Microsoft Word (.docx)',
        'pdf-to-ppt': 'Microsoft PowerPoint (.pptx)',
        'pdf-to-excel': 'Microsoft Excel (.xlsx)',
        'pdf-to-images': 'ZIP file with Images',
        'pdf-to-text': 'Plain Text (.txt)',
        'compress-pdf': 'Compressed PDF (.pdf)',
        'images-to-pdf': 'PDF Document (.pdf)',
        'compress-image': 'Compressed Image',
        'json-to-pdf': 'PDF Document (.pdf)',
        'xml-to-pdf': 'PDF Document (.pdf)',
        'yaml-to-pdf': 'PDF Document (.pdf)',
        'text-to-pdf': 'PDF Document (.pdf)',
        'xml-json': 'JSON or XML Document'
    };

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(li => {
                li.classList.remove('active');
            });
            
            // Add active class to parent li
            item.parentElement.classList.add('active');
            
            // Update title
            const toolName = item.textContent.trim();
            titleElement.textContent = toolName;
            
            // Update target format in modal
            const toolId = item.getAttribute('data-tool');
            targetFormatElement.textContent = toolFormats[toolId] || 'Converted Document';

            // Extract section category (e.g. PDF Tools) dynamically from parent nav-section
            const sectionTitle = item.closest('.nav-section').querySelector('.nav-title').textContent.trim();
            const breadcrumbSection = document.getElementById('breadcrumb-section');
            const breadcrumbSeparator2 = document.getElementById('breadcrumb-separator-2');
            
            breadcrumbSection.textContent = sectionTitle;
            breadcrumbSection.style.display = 'inline';
            breadcrumbSeparator2.style.display = 'inline';

            // Update dashboard workspace header
            const dashboardTitle = document.getElementById('tool-dashboard-title');
            dashboardTitle.textContent = `${toolName} Workspace`;
            
            // Show dashboard workspace and hide home view
            document.getElementById('dashboard-view').classList.remove('hidden');
            document.getElementById('home-view').classList.add('hidden');
        });
    });

    /* ===== Return to Home View ===== */
    const showHomeView = () => {
        // Remove active class from all sidebar nav items
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(li => {
            li.classList.remove('active');
        });
        
        // Update breadcrumbs to home state
        const breadcrumbSection = document.getElementById('breadcrumb-section');
        const breadcrumbSeparator2 = document.getElementById('breadcrumb-separator-2');
        titleElement.textContent = 'Welcome';
        if (breadcrumbSection) breadcrumbSection.style.display = 'none';
        if (breadcrumbSeparator2) breadcrumbSeparator2.style.display = 'none';
        
        // Show home welcome view and hide tool dashboard workspace
        document.getElementById('home-view').classList.remove('hidden');
        document.getElementById('dashboard-view').classList.add('hidden');
    };

    const brandBtn = document.getElementById('brand-logo-btn');
    const breadcrumbBrand = document.getElementById('breadcrumb-brand');
    
    if (brandBtn) brandBtn.addEventListener('click', showHomeView);
    if (breadcrumbBrand) breadcrumbBrand.addEventListener('click', showHomeView);

    /* ===== Drag and Drop & File Upload ===== */
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadForm = document.getElementById('upload-form');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    dropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFiles, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            fileInput.files = files; // Update input with dropped files
            startConversionProcess(files[0]);
        }
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files.length > 0) {
            startConversionProcess(files[0]);
        }
    }

    /* ===== Progress Overlay Simulation ===== */
    const progressOverlay = document.getElementById('progress-overlay');
    const progressFilename = document.getElementById('progress-filename');
    const progressFilesize = document.getElementById('progress-filesize');
    const sourceName = document.getElementById('source-name');
    const progressRingFill = document.querySelector('.progress-ring-fill');
    const percentageText = document.getElementById('percentage-text');
    const statusText = document.getElementById('status-text');

    function formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function setProgress(percent) {
        const circumference = 440; // 2 * PI * 70
        const offset = circumference - (percent / 100) * circumference;
        progressRingFill.style.strokeDashoffset = offset;
        percentageText.textContent = `${percent}%`;
    }

    function startConversionProcess(file) {
        // Update modal info
        progressFilename.textContent = file.name;
        const sizeStr = formatBytes(file.size);
        progressFilesize.textContent = `Size: ${sizeStr}`;
        sourceName.textContent = `${file.name} (${sizeStr})`;
        
        // Reset progress
        let progressValue = 0;
        setProgress(progressValue);
        statusText.textContent = 'Uploading...';
        
        // Show overlay
        progressOverlay.classList.add('active');

        // Simulate upload and conversion process using recursive setTimeout for dynamic speed easing
        function tick() {
            progressValue++;
            setProgress(progressValue);
            
            let currentSpeed = 10; // Default fast tick rate
            
            // Realistic stages with different easing speeds
            if (progressValue < 30) {
                statusText.textContent = 'Uploading...';
                currentSpeed = 12; // Fast upload
            } else if (progressValue < 85) {
                statusText.textContent = 'Converting...';
                currentSpeed = 8;  // Super fast conversion
            } else if (progressValue < 100) {
                statusText.textContent = 'Finalizing...';
                currentSpeed = 25; // Brief slowing down for realistic finalization
            }
            
            if (progressValue >= 100) {
                statusText.textContent = 'Done!';
                
                setTimeout(() => {
                    progressOverlay.classList.remove('active');
                    alert(`Conversion of ${file.name} complete!\n\nNote: This is a static demo. Real file conversions are processed locally by the Python Flask backend.`);
                    uploadForm.reset();
                }, 600); // Snappy closing transition
            } else {
                setTimeout(tick, currentSpeed);
            }
        }
        
        // Start simulation immediately with a tiny delay
        setTimeout(tick, 10);
    }
});
