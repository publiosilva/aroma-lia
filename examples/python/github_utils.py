import requests

class GitHubUtils:
    def __init__(self):
        self.base_url = "https://api.github.com"

    def get_user_repositories(self, username):
        """
        Get the list of repositories for a given GitHub user.

        Args:
        username (str): The GitHub username.

        Returns:
        list: A list of repository names.
        """
        url = f"{self.base_url}/users/{username}/repos"
        response = requests.get(url)
        if response.status_code == 200:
            repositories = [repo['name'] for repo in response.json()]
            return repositories
        else:
            print(f"Failed to fetch repositories for user {username}.")
            return []

    def get_user_image(self, username):
        """
        Get the profile image URL for a given GitHub user.

        Args:
        username (str): The GitHub username.

        Returns:
        str: The URL of the user's profile image.
        """
        url = f"{self.base_url}/users/{username}"
        response = requests.get(url)
        if response.status_code == 200:
            user_data = response.json()
            return user_data['avatar_url']
        else:
            print(f"Failed to fetch user image for user {username}.")
            return None

# Example usage:
# github_utils = GitHubUtils()
# username = "your_github_username"
# repos = github_utils.get_user_repositories(username)
# print(f"Repositories for {username}: {repos}")

# user_image_url = github_utils.get_user_image(username)
# print(f"Profile image URL for {username}: {user_image_url}")
