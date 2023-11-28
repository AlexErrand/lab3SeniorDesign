/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

type LoginRequest = {
	username: string;
	password: string;
  };


export interface Env {
	USERDATA : KVNamespace;
}

const corsHeaders = {
	'Access-Control-Allow-Origin': 'https://seaman-squad.pages.dev',
	'Access-Control-Allow-Credentials': 'true',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
  };
  
  function handleOptions(request: Request) {
	
	if (
	  request.headers.get('Origin') !== null &&
	  request.headers.get('Access-Control-Request-Method') !== null &&
	  request.headers.get('Access-Control-Request-Headers') !== null
	) {
	  // Handle CORS pre-flight request.
	  return new Response(null, {
		headers: corsHeaders,
	  });
	} else {
	  // Handle standard OPTIONS request.
	  return new Response(null, {
		headers: {
		  Allow: 'GET, POST, OPTIONS',
		},
	  });
	}
  }

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	  const url = new URL(request.url);
	  
	  if (request.method === 'OPTIONS') {
		return handleOptions(request);
	  }

	  if (request.method === "POST" && url.pathname === "https://kvwrangler.azulitepoke.workers.dev/api/login") {
		
		const { username, password }: LoginRequest = await request.json();
  
		const userData = await env.USERDATA.get(username);
		if (userData) {
		  const user = JSON.parse(userData);
		  if (user.password === password) {
			// Password matches, proceed with login
			return new Response("Login Successful", { status: 200 , headers: corsHeaders});
		  } else {
			// Password does not match, return an error
			return new Response("Invalid password", { status: 403 });
		  }
		} else {
		  // Username not found, return an error
		  return new Response("User not found", { status: 404 });
		}
	  }
  
	  return new Response("Service running", { status: 200 ,headers: corsHeaders});
	},
  };