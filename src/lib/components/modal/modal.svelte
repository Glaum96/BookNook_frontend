<script>
	console.log('Modal component loaded') // This will log when the modal component is loaded, useful for debugging purposes
</script>

<div>
	<!-- Modal content goes here -->
	<div class="modal">
		<div class="modal-content">
			<span class="close" onclick="this.parentElement.style.display='none'">&times;</span>
			<p>Some text in the Modal..</p>
		</div>
	</div>
</div>
