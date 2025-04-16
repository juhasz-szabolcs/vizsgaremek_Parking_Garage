<script>
    import { register } from '$lib/api';
    import { goto } from '$app/navigation';
    
    let firstName = '';
    let lastName = '';
    let phoneNumber = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let error = '';
    let success = '';
    let loading = false;
    
    async function handleSubmit() {
      error = '';
      success = '';
      loading = true;
      
      // Validate inputs
      if (!firstName || !lastName || !phoneNumber || !email || !password) {
        error = 'Kérjük, töltse ki az összes mezőt!';
        loading = false;
        return;
      }
      
      if (password !== confirmPassword) {
        error = 'A jelszavak nem egyeznek meg!';
        loading = false;
        return;
      }
      
      const userData = {
        firstName,
        lastName,
        phoneNumber,
        email,
        passwordHash: password,
        isAdmin: false,
        cars: []
      };
      
      try {
        const result = await register(userData);
        
        if (result.success) {
          success = 'Sikeres regisztráció! Átirányítás a bejelentkezési oldalra...';
          setTimeout(() => goto('/login'), 2000);
        } else {
          error = typeof result.error === 'string' 
            ? result.error 
            : 'Sikertelen regisztráció. Kérjük, próbálja újra.';
        }
      } catch (err) {
        console.error('Registration error:', err);
        error = 'Hiba történt a regisztráció során. Kérjük, próbálja újra.';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="register-container">
    <div class="form-card">
      <h1>Regisztráció</h1>
      
      {#if error}
        <div class="error-message">{error}</div>
      {/if}
      
      {#if success}
        <div class="success-message">{success}</div>
      {/if}
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">Vezetéknév</label>
            <input 
              type="text" 
              id="firstName" 
              bind:value={firstName} 
              placeholder="Vezetéknév"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="lastName">Keresztnév</label>
            <input 
              type="text" 
              id="lastName" 
              bind:value={lastName} 
              placeholder="Keresztnév"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="phoneNumber">Telefonszám</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            bind:value={phoneNumber} 
            placeholder="+36 (30) 123-4567"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">E-mail cím</label>
          <input 
            type="email" 
            id="email" 
            bind:value={email} 
            placeholder="pelda@email.com"
            required
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="password">Jelszó</label>
            <input 
              type="password" 
              id="password" 
              bind:value={password}
              required
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Jelszó megerősítése</label>
            <input 
              type="password" 
              id="confirmPassword" 
              bind:value={confirmPassword}
              required
            />
          </div>
        </div>
        
        <button type="submit" id="register-button" class="submit-button" disabled={loading}>
          {loading ? 'Regisztráció...' : 'Regisztráció'}
        </button>
      </form>
      
      <div class="form-footer">
        <p>Már van fiókja? <a href="/login">Jelentkezzen be itt</a></p>
      </div>
    </div>
  </div>
  
  <style>
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
      padding: 2rem 0;
    }
    
    .form-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      width: 100%;
      max-width: 600px;
    }
    
    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
    
    .form-group {
      flex: 1;
      margin-bottom: 1.5rem;
    }
    
    .form-row .form-group {
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #34495e;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    
    .submit-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .submit-button:hover:not(:disabled) {
      background-color: #2980b9;
    }
    
    .submit-button:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }
    
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    
    .success-message {
      background-color: #d4edda;
      color: #155724;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    
    .form-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
    }
    
    .form-footer a {
      color: #3498db;
      text-decoration: none;
    }
    
    .form-footer a:hover {
      text-decoration: underline;
    }
  </style>