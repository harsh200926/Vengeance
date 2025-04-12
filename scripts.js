document.addEventListener('DOMContentLoaded', function() {
    // Landing page transition
    const landingContainer = document.getElementById('landingContainer');
    const mainContent = document.getElementById('mainContent');
    const enterButton = document.getElementById('enterButton');

    // Entry button click event
    enterButton.addEventListener('click', function() {
        landingContainer.style.opacity = '0';
        landingContainer.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            landingContainer.style.display = 'none';
            mainContent.style.opacity = '1';
            // Load entries after transition
            loadEntries();
            // Load quotes after transition
            loadQuotes();
        }, 1500);
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section-container');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections and show target section
            sections.forEach(section => section.classList.remove('active-section'));
            document.getElementById(targetSection).classList.add('active-section');
        });
    });

    // Modal functionality
    const modal = document.getElementById('entryModal');
    const closeButton = document.querySelector('.close-button');
    const modalDate = document.getElementById('modalDate');
    const modalContent = document.getElementById('modalContent');

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Diary entries data structure
    const entries = [];
    
    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Function to extract month from date
    function extractMonth(dateString) {
        return dateString.split('-')[1]; // Extracts month from YYYY-MM-DD
    }

    // Function to fix emoji encoding
    function fixEmojiEncoding(text) {
        // Replace common problematic patterns with their actual emoji and special character representation
        return text
            // Fix emojis
            .replace(/ðŸ'–/g, '💖')
            .replace(/ðŸ'ðŸ'Œ/g, '💐💌')
            .replace(/ðŸ'Œ/g, '💌')
            .replace(/ðŸ'/g, '💐')
            .replace(/ðŸ«¶/g, '🫶')
            .replace(/ðŸ«´/g, '🫴')
            .replace(/ðŸ'«/g, '💫')
            .replace(/ðŸ•Šï¸/g, '🕊️')
            .replace(/ðŸ•Š/g, '🕊')
            .replace(/ðŸ'"/g, '💞')
            .replace(/ðŸ˜­/g, '😭')
            .replace(/ðŸ¥¹/g, '🥹')
            .replace(/ðŸ™‚/g, '🙂')
            .replace(/ðŸ'©/g, '💩')
            .replace(/â¤ï¸â€/g, '❤️‍')
            .replace(/â¤ï¸ðŸ©¹/g, '❤️‍🩹')
            .replace(/â¤ï¸/g, '❤️')
            .replace(/âœ¨/g, '✨')
            .replace(/ðŸŒ¼/g, '🌼')
            .replace(/ðŸŒ·/g, '🌷')
            .replace(/ðŸŒ¹/g, '🌹')
            .replace(/ðŸ'š/g, '💚')
            .replace(/ðŸ'"/g, '💝')
            .replace(/ðŸ'—/g, '💗')
            .replace(/ðŸ'"/g, '💓')
            .replace(/ðŸ'€/g, '💀')
            .replace(/ðŸ§¸/g, '🧸')
            .replace(/ðŸ¥‚/g, '🥂')
            .replace(/ðŸ'€/g, '👀')
            .replace(/ðŸ¤Œ/g, '🤌')
            .replace(/ðŸŒ¸/g, '🌸')
            .replace(/ðŸª·/g, '🪷')
            .replace(/ðŸ'‹/g, '💋')
            .replace(/ðŸ¤/g, '😍')
            .replace(/ðŸ¥°/g, '🥰')
            .replace(/ðŸŸ¢/g, '🟢')
            .replace(/ðŸ"¥/g, '🔥')
            .replace(/ðŸŒŸ/g, '🌟')
            .replace(/ðŸ§¿/g, '🧿')
            .replace(/ðŸŒ§ï¸/g, '🌧️')
            .replace(/ðŸŽ­/g, '🎭')
            .replace(/ðŸ¤/g, '🫠')
            .replace(/ðŸ¦¢/g, '🦢')
            .replace(/ðŸ§/g, '🧠')
            .replace(/ðŸ§¡/g, '🧡')
            .replace(/ðŸ'œ/g, '💜')
            .replace(/ðŸ'›/g, '💛')
            .replace(/ðŸ¥º/g, '🥺')
            .replace(/ðŸ«¡/g, '🫡')
            .replace(/ðŸ§¿/g, '🧿')
            
            // Fix Devanagari and other special characters
            .replace(/jiÃ¶Å¸"Ã¶Å¸"-/g, "जी❤️")
            .replace(/jiÃ¶Å¸â€˜Ã¶Å¸â€™-/g, "जी❤️")
            .replace(/jiÃ¶Å¸Ã¶Å¸-/g, "जी❤️")
            .replace(/jÃ®âˆ™HÃ¢âˆ™-/g, "जी❤️")
            .replace(/ji(.*?)-(.*?)-/g, "जी❤️")
            .replace(/à¤œà¥€/g, "जी")
            .replace(/jiðŸ¶Å"ðŸ¶Å"-/g, "जी❤️")
            .replace(/jiðŸ¶Å"?ðŸ¶Å"?-/g, "जी❤️")
            
            // Fix Hindi paragraphs from journal - specific replacement patterns
            .replace(/à¤…à¤¸à¤«à¤²à¤¤à¤¾ à¤à¤• à¤šà¥à¤¨à¥Œà¤¤à¥€ à¤¹à¥ˆ/g, "असफलता एक चुनौती है")
            .replace(/à¤…à¤‚à¤¤ à¤®à¥‡à¤‚ à¤šà¥€à¤œà¤¼à¥‡ à¤…à¤ªà¤¨à¥‡ à¤†à¤ª à¤¸à¤¹à¥€ à¤¹à¥‹à¤‚à¤—à¥€à¥¤/g, "अंत में चीज़े अपने आप सही होंगी।")
            .replace(/à¤•à¥‹à¤ˆ à¤¬à¤¹à¤¾à¤¨à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¸à¥à¤¨à¤¤à¤¾à¥¤/g, "कोई बहाना नहीं सुनता।")
            
            // More specific pattern for entire Hindi paragraphs using broader match
            .replace(/à¤([^\s]*)/g, function(match) {
                try {
                    // Convert encoded Devanagari to actual Devanagari
                    return decodeURIComponent(escape(match));
                } catch (e) {
                    // If decoding fails, attempt character by character replacement
                    return match
                        .replace(/à¤…/g, 'अ')
                        .replace(/à¤†/g, 'आ')
                        .replace(/à¤‡/g, 'इ')
                        .replace(/à¤ˆ/g, 'ई')
                        .replace(/à¤‰/g, 'उ')
                        .replace(/à¤Š/g, 'ऊ')
                        .replace(/à¤‹/g, 'ऋ')
                        .replace(/à¤/g, 'ए')
                        .replace(/à¤"/g, 'ऐ')
                        .replace(/à¤"/g, 'ओ')
                        .replace(/à¤"/g, 'औ')
                        .replace(/à¤•/g, 'क')
                        .replace(/à¤–/g, 'ख')
                        .replace(/à¤—/g, 'ग')
                        .replace(/à¤˜/g, 'घ')
                        .replace(/à¤™/g, 'ङ')
                        .replace(/à¤š/g, 'च')
                        .replace(/à¤›/g, 'छ')
                        .replace(/à¤œ/g, 'ज')
                        .replace(/à¤/g, 'झ')
                        .replace(/à¤ž/g, 'ञ')
                        .replace(/à¤Ÿ/g, 'ट')
                        .replace(/à¤ /g, 'ठ')
                        .replace(/à¤¡/g, 'ड')
                        .replace(/à¤¢/g, 'ढ')
                        .replace(/à¤£/g, 'ण')
                        .replace(/à¤¤/g, 'त')
                        .replace(/à¤¥/g, 'थ')
                        .replace(/à¤¦/g, 'द')
                        .replace(/à¤§/g, 'ध')
                        .replace(/à¤¨/g, 'न')
                        .replace(/à¤ª/g, 'प')
                        .replace(/à¤«/g, 'फ')
                        .replace(/à¤¬/g, 'ब')
                        .replace(/à¤­/g, 'भ')
                        .replace(/à¤®/g, 'म')
                        .replace(/à¤¯/g, 'य')
                        .replace(/à¤°/g, 'र')
                        .replace(/à¤²/g, 'ल')
                        .replace(/à¤µ/g, 'व')
                        .replace(/à¤¶/g, 'श')
                        .replace(/à¤·/g, 'ष')
                        .replace(/à¤¸/g, 'स')
                        .replace(/à¤¹/g, 'ह')
                        .replace(/à¤¼/g, '़')
                        .replace(/à¤¾/g, 'ा')
                        .replace(/à¤¿/g, 'ि')
                        .replace(/à¥€/g, 'ी')
                        .replace(/à¥/g, 'ु')
                        .replace(/à¥‚/g, 'ू')
                        .replace(/à¥ƒ/g, 'ृ')
                        .replace(/à¥‡/g, 'े')
                        .replace(/à¥ˆ/g, 'ै')
                        .replace(/à¥‹/g, 'ो')
                        .replace(/à¥Œ/g, 'ौ')
                        .replace(/à¥/g, '्')
                        .replace(/à¤‚/g, 'ं')
                        .replace(/à¤ƒ/g, 'ः')
                        .replace(/à¥¤/g, '।')
                        .replace(/à¥¥/g, '॥');
                }
            })
            
            // Handle some specific Hindi text patterns seen in the entries
            .replace(/piyaðŸ¶Å"/g, "पिया❤️")
            .replace(/TUMHE PATA HAI/g, "तुम्हे पता है")
            
            // Decode HTML entities for special characters
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#x27;/g, "'")
            
            // Convert encoding sequences for various languages
            .replace(/([\u0080-\u07FF\u0800-\uFFFF]+)/g, function(match) {
                try {
                    // Attempt to properly decode UTF-8 sequences
                    return decodeURIComponent(escape(match));
                } catch (e) {
                    // If decoding fails, return the original text
                    return match;
                }
            });
    }

    // Function to load entries
    async function loadEntries() {
        const entriesContainer = document.getElementById('entriesContainer');
        entriesContainer.innerHTML = ''; // Clear previous content
        
        try {
            // Fetch the list of all diary entries
            const fileList = await fetchFileList();
            
            // Process each file
            for (const file of fileList) {
                try {
                    // Update the path to handle deployed environment properly
                    const response = await fetch(`./DiaryEntries/${file}`);
                    if (!response.ok) {
                        console.error(`Failed to fetch ${file}, status: ${response.status}`);
                        continue; // Skip this file and continue with the next
                    }
                    
                    const content = await response.text();
                    const fixedContent = fixEmojiEncoding(content);
                    
                    // Parse entry details
                    const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
                    if (dateMatch) {
                        const dateStr = `${dateMatch[1]} ${dateMatch[2].replace(/-/g, ':')}`;
                        
                        // Create entry object
                        const entry = {
                            date: dateStr,
                            formattedDate: formatDate(dateStr),
                            content: fixedContent,
                            fileName: file,
                            month: extractMonth(dateMatch[1])
                        };
                        
                        entries.push(entry);
                    }
                } catch (error) {
                    console.error(`Error processing ${file}:`, error);
                }
            }
            
            // Sort entries by date (newest first)
            entries.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Display entries
            displayEntries(entries);
            
        } catch (error) {
            console.error('Error loading entries:', error);
            entriesContainer.innerHTML = `
                <div class="error-message">
                    <p>Could not load the diary entries. Please try again later.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Function to fetch file list (simulated as we can't directly fetch from the filesystem in a browser)
    // In a real environment, this would be handled by a server-side API
    async function fetchFileList() {
        // First try the PHP endpoint
        try {
            const response = await fetch('./get_diary_entries.php');
            if (response.ok) {
                const data = await response.json();
                console.log('Successfully fetched file list from PHP:', data);
                return data;
            } else {
                console.error('Failed to fetch file list from PHP:', response.status);
                // Don't throw, try next method
            }
        } catch (error) {
            console.warn('Could not fetch file list from PHP, trying static JSON file', error);
        }
        
        // Second, try a static JSON file (entries.json) that could be pre-generated
        try {
            const response = await fetch('./entries.json');
            if (response.ok) {
                const data = await response.json();
                console.log('Successfully fetched file list from static JSON:', data);
                return data;
            } else {
                console.error('Failed to fetch static entries.json:', response.status);
                // Don't throw, use hardcoded fallback
            }
        } catch (error) {
            console.warn('Could not fetch static entries.json, using hardcoded fallback list', error);
        }
        
        // Finally, use the hardcoded fallback list
        console.log('Using hardcoded fallback list of entries');
        return [
            "2024-06-20_21-39-47.txt",
            "2024-06-21_09-58-52.txt",
            "2024-06-21_18-02-58.txt",
            "2024-06-22_08-46-55.txt",
            "2024-06-23_09-12-35.txt",
            "2024-06-24_07-41-59.txt",
            "2024-06-25_06-36-16.txt",
            "2024-06-26_07-05-52.txt",
            "2024-06-27_06-55-04.txt",
            "2024-06-28_05-30-31.txt",
            "2024-06-29_09-40-06.txt",
            "2024-06-30_07-59-27.txt",
            "2024-07-01_08-28-50.txt",
            "2024-07-02_21-18-03.txt",
            "2024-07-03_06-20-38.txt",
            "2024-07-04_23-21-00.txt",
            "2024-07-05_23-46-51.txt",
            "2024-07-06_16-03-07.txt",
            "2024-07-07_21-35-43.txt",
            "2024-07-08_06-01-33.txt",
            "2024-07-09_12-01-27.txt",
            "2024-07-10_22-57-47.txt",
            "2024-07-11_18-02-50.txt",
            "2024-07-12_09-57-09.txt",
            "2024-07-13_08-10-41.txt",
            "2024-07-14_21-33-30.txt",
            "2024-07-15_21-39-24.txt",
            "2024-07-16_14-14-15.txt",
            "2024-07-17_08-08-33.txt",
            "2024-07-18_05-25-00.txt",
            "2024-07-19_13-48-47.txt",
            "2024-07-20_19-51-03.txt",
            "2024-07-21_05-18-47.txt",
            "2024-07-22_09-17-12.txt",
            "2024-07-23_18-08-30.txt",
            "2024-07-24_05-58-47.txt",
            "2024-07-25_18-13-14.txt",
            "2024-07-26_11-15-45.txt",
            "2024-07-27_07-21-28.txt",
            "2024-07-28_14-57-59.txt",
            "2024-07-29_18-13-33.txt",
            "2024-07-30_21-32-34.txt",
            "2024-07-31_20-46-03.txt",
            "2024-08-01_20-29-58.txt",
            "2024-08-02_12-37-41.txt",
            "2024-08-03_18-11-25.txt",
            "2024-08-04_23-33-26.txt",
            "2024-08-05_23-35-46.txt",
            "2024-08-06_23-01-29.txt",
            "2024-08-07_16-41-18.txt",
            "2024-08-08_17-56-19.txt",
            "2024-08-09_19-49-36.txt",
            "2024-08-11_20-57-19.txt",
            "2024-08-19_07-59-10.txt",
            "2024-08-24_23-04-03.txt",
            "2024-08-25_03-07-10.txt",
            "2024-08-26_11-02-56.txt",
            "2024-08-28_21-28-28.txt",
            "2024-09-05_15-02-06.txt",
            "2024-09-11_00-03-06.txt",
            "2024-09-12_18-15-20.txt",
            "2024-09-13_09-20-17.txt",
            "2024-09-14_00-59-26.txt",
            "2024-09-15_17-28-28.txt",
            "2024-09-16_10-37-27.txt",
            "2024-09-16_10-37-58.txt",
            "2024-09-16_10-38-12.txt",
            "2024-09-16_10-38-39.txt",
            "2024-09-17_22-51-55.txt",
            "2024-09-19_18-32-29.txt",
            "2024-09-23_23-13-22.txt",
            "2024-10-08_22-30-54.txt",
            "2024-10-11_14-48-03.txt",
            "2024-10-12_23-01-55.txt",
            "2024-10-13_23-00-18.txt",
            "2024-10-14_11-01-00.txt",
            "2024-10-15_22-58-12.txt",
            "2024-10-26_14-20-39.txt",
            "2024-10-31_13-27-59.txt",
            "2024-11-11_22-54-53.txt"
        ];
    }

    // Function to display entries
    function displayEntries(entriesList) {
        const entriesContainer = document.getElementById('entriesContainer');
        entriesContainer.innerHTML = ''; // Clear loading message
        
        if (entriesList.length === 0) {
            entriesContainer.innerHTML = '<p class="no-entries">No entries found.</p>';
            return;
        }
        
        // Create entry cards
        entriesList.forEach(entry => {
            // Get content preview (first 200 characters)
            const contentLines = entry.content.split('\n').slice(2); // Skip date and separator line
            const contentText = contentLines.join('\n').trim();
            const previewText = contentText.substring(0, 200) + (contentText.length > 200 ? '...' : '');
            
            // Apply proper styling for Devanagari text
            const processedPreview = applyHindiClass(previewText);
            
            const entryCard = document.createElement('div');
            entryCard.className = 'entry-card';
            entryCard.innerHTML = `
                <div class="entry-date">${entry.formattedDate}</div>
                <div class="entry-preview">${processedPreview}</div>
                <span class="read-more">Read more...</span>
            `;
            
            // Add click event to open modal with full entry
            entryCard.addEventListener('click', function() {
                modalDate.textContent = entry.formattedDate;
                
                // Apply proper styling for Hindi text in modal
                const processedContent = applyHindiClass(entry.content);
                modalContent.innerHTML = processedContent;
                
                modal.style.display = 'block';
            });
            
            entriesContainer.appendChild(entryCard);
        });
    }

    // Function to apply Hindi class to Devanagari text
    function applyHindiClass(text) {
        // Detect Devanagari script and apply proper class
        return text.replace(/[\u0900-\u097F]+/g, match => `<span class="hindi-text">${match}</span>`);
    }

    // Search and filter functionality
    const searchInput = document.getElementById('searchEntries');
    const monthFilter = document.getElementById('monthFilter');
    
    searchInput.addEventListener('input', filterEntries);
    monthFilter.addEventListener('change', filterEntries);
    
    function filterEntries() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedMonth = monthFilter.value;
        
        const filteredEntries = entries.filter(entry => {
            const matchesSearchTerm = !searchTerm || 
                entry.content.toLowerCase().includes(searchTerm) || 
                entry.formattedDate.toLowerCase().includes(searchTerm);
                
            const matchesMonth = !selectedMonth || entry.month === selectedMonth;
            
            return matchesSearchTerm && matchesMonth;
        });
        
        displayEntries(filteredEntries);
    }

    // Quotes functionality
    // Memorable quotes from diary entries
    const quotes = [
        {
            text: "I will love you until my last breath once again Love you! 💖",
            date: "June 20, 2024"
        },
        {
            text: "I believe in shree krishna and maa gayatri that they will fulfill my wishes I just want her to be happy, and with me if she agrees.",
            date: "June 20, 2024"
        },
        {
            text: "When men learn to feel love, he also must bear the risk of feeling hate.",
            date: "June 23, 2024"
        },
        {
            text: "Words may fall short to describe her beauty but my eyes can read it in a moment and I cannot describe it.",
            date: "June 26, 2024"
        },
        {
            text: "Go to a war against the man in the mirror, and don't come back until you win!",
            date: "June 28, 2024"
        },
        {
            text: "The deeper the injury or the hurt that stays in the heart, the more poisonous the emotion, believe me!",
            date: "June 30, 2024"
        },
        {
            text: "You are the girl who makes me feel that love is still not impossible in this generation.",
            date: "July 16, 2024"
        },
        {
            text: "I feel that I am talking to you, that's why i write it because I can't talk to you.",
            date: "June 28, 2024"
        },
        {
            text: "If something is free then its value will always be zero because when you achieve something by your willingness then its importance towards you become priceless.",
            date: "June 30, 2024"
        },
        {
            text: "I just want you and nothing more I want from god.",
            date: "July 15, 2024"
        },
        {
            text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
            date: "September 16, 2024"
        },
        {
            text: "Our story hasn't ended!",
            date: "August 28, 2024"
        },
        {
            text: "When you left, you left a void to me that I can't ever fill again!",
            date: "October 11, 2024"
        },
        {
            text: "Your memories are indelible!",
            date: "October 26, 2024"
        },
        {
            text: "You are the melody that plays in my mind and the warmth in my heart.",
            date: "Forever"
        }
    ];

    // Function to load quotes
    function loadQuotes() {
        const quotesContainer = document.getElementById('quotesContainer');
        
        quotes.forEach(quote => {
            // Apply proper styling for Hindi text in quotes
            const processedText = applyHindiClass(quote.text);
            
            const quoteCard = document.createElement('div');
            quoteCard.className = 'quote-card';
            quoteCard.innerHTML = `
                <div class="quote-content">${processedText}</div>
                <div class="quote-date">${quote.date}</div>
            `;
            quotesContainer.appendChild(quoteCard);
        });
    }
});

// Function to simulate fetching entry content (since we can't directly read files from the filesystem)
// In a real environment, these would be fetched from a server
async function fetchEntryContent(fileName) {
    // This is a simplified simulation
    try {
        const response = await fetch(`DiaryEntries/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${fileName}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error fetching content for ${fileName}:`, error);
        return "Could not load entry content.";
    }
} 