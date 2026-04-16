FROM python:3.11-slim
WORKDIR /Backend

# Copy and install backend dependencies
COPY Backend/requirements.txt ./backend/
RUN pip install -r backend/requirements.txt

# Copy both folders into the container
COPY Backend/ ./Backend/
COPY . .

# Run the app from the backend folder
CMD ["python", "Backend/app.py"]