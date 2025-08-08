# JobHut: How to Add a New External Job API

This guide covers **every step and detail** for adding a new job API to JobHut, including field mapping, troubleshooting, and best practices. Follow this for a smooth, no-code integration!

---

## 1. Go to **Manage External API Configs** (Admin UI)
- You’ll find this in your admin dashboard.

---

## 2. Click **Add New API**
- This opens the form to add a new API source.

---

## 3. Fill Out the API Config Fields

### **Required Fields & What They Mean**

| Field         | What to Enter                                                                                   | Example (Remote OK)                                  |
|---------------|------------------------------------------------------------------------------------------------|------------------------------------------------------|
| id            | A unique short name for this API (no spaces, lowercase)                                        | `remoteok`                                           |
| name          | Display name for the API                                                                       | `Remote OK`                                          |
| host          | The host/domain of the API (for info or headers)                                               | `remoteok.io`                                        |
| endpoint      | The full API endpoint URL                                                                      | `https://remoteok.io/api`                            |
| key           | API key if required (leave blank if not)                                                       | (blank)                                              |
| enabled       | Check to enable this API for import                                                            | (checked)                                            |
| method        | HTTP method (usually `GET`)                                                                    | `GET`                                                |
| headers       | JSON object for custom headers (API key, host, etc.)                                           | `{}` or `{ "x-rapidapi-key": "KEY", ... }`           |
| queryTemplate | (Optional) Query string template, use `{title}` and `{location}` for dynamic search            | `?title={title}&location={location}`                 |
| jobsPath      | (Optional) Path to jobs array in response (e.g. `data`, `items`, or leave blank for root)      | `data`                                               |
| fieldMap      | JSON object mapping your internal fields to the API’s fields (see below for details)           | See below                                            |

---

### **How to Write a Field Map**

- Use the API’s raw job object (see “Show Raw Data” in import UI) to determine the correct field names.
- For nested fields, use dot notation (e.g. `"companyName": "organization.name"`).
- **Do not map to an object or array!** Always map to a string or number field.
- Example for Remote OK:
  ```json
  {
    "title": "position",
    "companyName": "company",
    "companyLogo": "company_logo",
    "overview": "description",
    "location": "location",
    "salary": "salary_min",
    "applyLink": "apply_url",
    "skills": "tags",
    "externalJobId": "id"
  }
  ```

---

### **Tips for Each Field**

- **id:** Use lowercase, no spaces, unique (e.g. `remoteok`, `githubjobs`, `devto`)
- **endpoint:** Must be a valid URL, including `https://`
- **headers:** Use `{}` if not needed. For RapidAPI, use:
  ```json
  {
    "x-rapidapi-key": "YOUR_KEY",
    "x-rapidapi-host": "API_HOST"
  }
  ```
- **jobsPath:** If the jobs are in a nested array, use the path (e.g. `data`, `items`). If jobs are at the root, leave blank.
- **fieldMap:** Map your internal fields to the API’s fields. Use dot notation for nested fields. **Never map to an object or array.**
- **queryTemplate:** Only use if the API supports filtering by title/location. Use `{title}` and `{location}` as placeholders.

---

## 4. **Save the API Config**
- Double-check all fields before saving.
- If you make a mistake, you can always edit or delete the config later.

---

## 5. **Test in Import Jobs UI**
- Go to “Import Jobs from External API”
- Select your new API source
- Search for jobs
- Use “Show Raw Data” to verify field mapping

---

## 6. **Troubleshooting & Common Issues**

- **No jobs appear:**
  - Check `jobsPath` (should match the array in the API response)
  - Check if the API is enabled
  - Check your endpoint and headers
- **Fields are missing or blank:**
  - Use “Show Raw Data” to see the real field names
  - Update your `fieldMap` to match the actual field names
- **React error about objects:**
  - You are mapping to an object or array. Use dot notation to map to a string (e.g. `"organization.name"`)
- **Company/location missing:**
  - Some APIs do not provide these fields. You may need to extract them from the description or use a fallback.
- **API key/auth errors:**
  - Make sure your key is correct and not expired
  - Check your quota/limits if using RapidAPI
- **Nested fields:**
  - Use dot notation (e.g. `"companyName": "organization.name"`)
- **RSS feeds:**
  - Use an RSS-to-JSON service and set `jobsPath` to `items`

---

## 7. **Example Configs**

### **Remote OK**
- endpoint: `https://remoteok.io/api`
- jobsPath: (blank)
- fieldMap:
  ```json
  {
    "title": "position",
    "companyName": "company",
    "companyLogo": "company_logo",
    "overview": "description",
    "location": "location",
    "salary": "salary_min",
    "applyLink": "apply_url",
    "skills": "tags",
    "externalJobId": "id"
  }
  ```

### **GitHub Jobs Mirror (Arbeitnow)**
- endpoint: `https://arbeitnow.com/api/job-board-api`
- jobsPath: `data`
- fieldMap:
  ```json
  {
    "title": "title",
    "companyName": "company",
    "companyLogo": "company_logo",
    "overview": "description",
    "location": "location",
    "salary": "salary",
    "applyLink": "url",
    "skills": "tags",
    "externalJobId": "slug"
  }
  ```

### **Dev.to Career Articles**
- endpoint: `https://dev.to/api/articles?tag=career`
- jobsPath: (blank)
- fieldMap:
  ```json
  {
    "title": "title",
    "companyName": "organization.name",
    "overview": "description",
    "location": "",
    "applyLink": "url",
    "externalJobId": "id"
  }
  ```

### **Python Job Board (via RSS2JSON)**
- endpoint: `https://api.rss2json.com/v1/api.json?rss_url=https://www.python.org/jobs/feed/rss/`
- jobsPath: `items`
- fieldMap:
  ```json
  {
    "title": "title",
    "companyName": "author",
    "overview": "description",
    "location": "",
    "applyLink": "link",
    "externalJobId": "guid"
  }
  ```

---

## 8. **If You Need to Map Nested Fields**
- Use dot notation: `"companyName": "organization.name"`
- If the value is still an object, check the raw data and try a different path.

---

## 9. **If You Need Help**
- Use “Show Raw Data” in the import UI to see the actual job object.
- Adjust your `fieldMap` to match the real field names.
- If you’re stuck, copy the raw job object and ask for help!
- You can always edit or delete an API config if you make a mistake.

---

**Save this document for future reference. You can now add any new job API to JobHut without code changes!** 