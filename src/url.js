// Get the current URL
 const extractURl= (()=>{
    
const url = window.location.href;

// Create a URL object
const urlObj = new URL(url);

// Get the hostname (e.g., bd3b2096-4a05-4bd3-816e-8bdada54b7d6.e1-us-east-azure.choreoapps.dev)
const hostname = urlObj.hostname;

// Check if the hostname ends with '.dev'
if (hostname.endsWith('.dev')) {
  return true;
} else {
  return false;
}
})
 export default extractURl;