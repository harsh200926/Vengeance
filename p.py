import streamlit as st
import codecs

# Title of the app
st.title("Piya's Journal Viewer")

# File uploader
uploaded_file = st.file_uploader("Upload your journal text file (e.g., .txt)", type="txt")

# Function to process and display the journal
def display_journal(content):
    # Split the content into lines
    lines = content.splitlines()
    current_date = None
    journal_entry = []

    # Process each line
    for line in lines:
        line = line.strip()
        if line and "-------------------" in line:
            # If we have a previous entry, display it
            if journal_entry and current_date:
                st.subheader(current_date)
                st.write("\n".join(journal_entry))
                st.write("---")
            journal_entry = []
        elif line and any(c.isdigit() for c in line) and ":" in line:
            current_date = line
        else:
            journal_entry.append(line)

    # Display the last entry if exists
    if journal_entry and current_date:
        st.subheader(current_date)
        st.write("\n".join(journal_entry))

# Check if a file is uploaded
if uploaded_file is not None:
    # Read the file with UTF-8 encoding to support emojis
    content = uploaded_file.read().decode("utf-8")
    
    # Display the journal
    st.write("### Journal Entries")
    display_journal(content)
else:
    st.write("Please upload a text file containing the journal entries.")

# Optional: Add a button to download the processed text
if uploaded_file is not None:
    processed_content = content
    st.download_button(
        label="Download Processed Text",
        data=processed_content,
        file_name="processed_journal.txt",
        mime="text/plain"
    )