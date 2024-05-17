import unittest
from unittest.mock import MagicMock, patch
from github_utils import GitHubUtils

class TestGitHubUtils(unittest.TestCase):

    def setUp(self):
        self.github_utils = GitHubUtils()

    @patch('github_utils.requests.get')
    def test_get_user_repositories_success(self, mock_get):
        # Mock the response of the requests.get() method
        expected_repos = [{'name': 'repo1'}, {'name': 'repo2'}, {'name': 'repo3'}]
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = expected_repos

        # Call the method to test
        repos = self.github_utils.get_user_repositories("test_user")

        # Check if the method returns the expected repositories
        self.assertEqual(repos, ['repo1', 'repo2', 'repo3'])

    @patch('github_utils.requests.get')
    def test_get_user_repositories_failure(self, mock_get):
        # Mock the response of the requests.get() method
        mock_get.return_value.status_code = 404

        # Call the method to test
        repos = self.github_utils.get_user_repositories("non_existing_user")

        # Check if the method returns an empty list on failure
        self.assertEqual(repos, [])

    @patch('github_utils.requests.get')
    def test_get_user_image_success(self, mock_get):
        # Mock the response of the requests.get() method
        expected_image_url = "https://example.com/avatar.jpg"
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'avatar_url': expected_image_url}

        # Call the method to test
        image_url = self.github_utils.get_user_image("test_user")

        # Check if the method returns the expected image URL
        self.assertEqual(image_url, expected_image_url)

    @patch('github_utils.requests.get')
    def test_get_user_image_failure(self, mock_get):
        # Mock the response of the requests.get() method
        mock_get.return_value.status_code = 404

        # Call the method to test
        image_url = self.github_utils.get_user_image("non_existing_user")

        # Check if the method returns None on failure
        self.assertIsNone(image_url)

if __name__ == '__main__':
    unittest.main()
