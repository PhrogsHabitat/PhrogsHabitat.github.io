import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Week 1: Data Acquisition and Cleaning

# Example: Importing CSV files
sales_data = pd.read_csv('path/to/sales_data.csv')
ratings_data = pd.read_csv('path/to/ratings_data.csv')
streaming_data = pd.read_csv('path/to/streaming_data.csv')

# Data Cleaning
# Handling missing values
sales_data.fillna(sales_data.mean(), inplace=True)
ratings_data.fillna(ratings_data.median(), inplace=True)
streaming_data.dropna(inplace=True)

# Removing duplicates
sales_data.drop_duplicates(inplace=True)
ratings_data.drop_duplicates(inplace=True)
streaming_data.drop_duplicates(inplace=True)

# Standardizing categorical data
sales_data['Genre'] = sales_data['Genre'].str.lower().str.replace(' ', '_')

# Saving cleaned data
sales_data.to_csv('cleaned_sales_data.csv', index=False)
ratings_data.to_csv('cleaned_ratings_data.csv', index=False)
streaming_data.to_csv('cleaned_streaming_data.csv', index=False)

# Data Cleaning Report
def generate_data_cleaning_report(dataframe, name):
    buffer = []
    buffer.append(f'{name} Data:\n')
    buffer.append(str(dataframe.info()))
    buffer.append('\n\n')
    return ''.join(buffer)

report_content = generate_data_cleaning_report(sales_data, 'Sales')
report_content += generate_data_cleaning_report(ratings_data, 'Ratings')
report_content += generate_data_cleaning_report(streaming_data, 'Streaming')

with open('data_cleaning_report.txt', 'w') as report_file:
    report_file.write(report_content)

# Week 2: Exploratory Data Analysis (EDA) - Genre and Rating Analysis

# Descriptive Statistics
# Calculate summary statistics
sales_stats = sales_data.describe()
ratings_stats = ratings_data.describe()
streaming_stats = streaming_data.describe()

# Analyze the distribution of game genres
genre_counts = sales_data['Genre'].value_counts()

# Visualizations
# Visualize rating distributions
plt.figure(figsize=(10, 6))
sns.histplot(ratings_data['Metacritic_score'], bins=20, kde=True)
plt.title('Distribution of Metacritic Scores')
plt.xlabel('Metacritic Score')
plt.ylabel('Frequency')
plt.savefig('metacritic_score_distribution.png')
plt.show()

# Visualize the relationship between genres and ratings
plt.figure(figsize=(15, 8))
sns.boxplot(x='Genre', y='Metacritic_score', data=ratings_data)
plt.xticks(rotation=90)
plt.title('Box Plot of Ratings by Genre')
plt.xlabel('Genre')
plt.ylabel('Metacritic Score')
plt.savefig('ratings_by_genre.png')
plt.show()

# Generate Genre and Rating Analysis Report with Visualizations
with open('genre_rating_analysis_report.txt', 'w') as report_file:
    report_file.write('Genre and Rating Analysis Report\n\n')
    report_file.write('Summary Statistics:\n')
    report_file.write(sales_stats.to_string())
    report_file.write('\n\n')
    report_file.write(ratings_stats.to_string())
    report_file.write('\n\n')
    report_file.write(streaming_stats.to_string())
    report_file.write('\n\n')
    report_file.write('Genre Counts:\n')
    report_file.write(genre_counts.to_string())
    report_file.write('\n\n')
    report_file.write('Visualizations:\n')
    report_file.write('1. Distribution of Metacritic Scores: metacritic_score_distribution.png\n')
    report_file.write('2. Box Plot of Ratings by Genre: ratings_by_genre.png\n')