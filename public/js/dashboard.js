document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-post-btn');
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const postId = event.target.getAttribute('data-id');
  
        if (confirm('Are you sure you want to delete this post?')) {
          const response = await fetch(`/delete-post/${postId}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            // Reload the page to reflect the changes
            document.location.replace('/dashboard');
          } else {
            alert('Failed to delete post.');
          }
        }
      });
    });
  });