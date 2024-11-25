import google.generativeai as genai
from django.conf import settings

def generate_summary(prompt):
    """Generate text using the Gemini API."""
    try:
        # Configure the API key
        genai.configure(api_key=settings.GEMINI_API_KEY)

        # Define generation configuration
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "application/json"
        }

        # Initialize the model
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
        )

        # Generate content
        response = model.generate_content(prompt)
        return response.text.strip()  # Return the generated text
    except Exception as e:
        print("Error generating summary:", e)
        raise e
