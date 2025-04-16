using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ParkingGarageAPI.Context;
using ParkingGarageAPI.Entities;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;

namespace ParkingGarageAPI.Controller;

[Route("api/cars")]
[ApiController]
[Authorize]
public class CarController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public CarController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public IActionResult GetUserCars()
    {
        try
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized("User not authenticated.");
                
            var user = _context.Users
                .Include(u => u.Cars)
                .FirstOrDefault(u => u.Email == userEmail);
            
            if (user == null)
                return NotFound("User not found.");
                
            if (user.Cars == null)
            {
                user.Cars = new List<Car>();
            }
            
            // Átalakítjuk az adatokat, hogy minden mező (beleértve az ID-t is) látható legyen
            var formattedCars = user.Cars.Select(c => new
            {
                c.Id,
                c.Brand,
                c.Model,
                c.Year,
                c.LicensePlate,
                c.IsParked
            }).ToList();
                
            return Ok(formattedCars);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
    [HttpPost]
    public IActionResult AddCar([FromBody] Car car)
    {
        try
        {
            if (car == null)
                return BadRequest("Car data is null");
                
            var userEmail = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized("User not authenticated.");
                
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
            
            if (user == null)
                return NotFound("User not found.");
            
            // Generálunk ID-t, ha nincs megadva
            if (car.Id <= 0)
            {
                int newId = _context.Cars.Any() ? _context.Cars.Max(c => c.Id) + 1 : 1;
                car.Id = newId;
            }
            
            // Biztosítjuk, hogy az IsParked értéke mindig false legyen új autó esetén
            car.IsParked = false;
                
            car.UserId = user.Id;
            _context.Cars.Add(car);
            _context.SaveChanges();
            
            // Visszadjuk az új autó adatait, beleértve az ID-t is
            return Ok(new
            {
                message = "Car added successfully.",
                car = new
                {
                    car.Id,
                    car.Brand,
                    car.Model,
                    car.Year,
                    car.LicensePlate,
                    car.UserId,
                    car.IsParked
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    
    [HttpDelete("{id}")]
    public IActionResult DeleteCar(int id)
    {
        try
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized("User not authenticated.");
                
            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
            
            if (user == null)
                return NotFound("User not found.");
            
            Car car;
            if (user.IsAdmin)
            {
                car = _context.Cars.FirstOrDefault(c => c.Id == id);
            }
            else
            {
                car = _context.Cars.FirstOrDefault(c => c.Id == id && c.UserId == user.Id);
            }
            
            if (car == null)
                return NotFound("Car not found or you don't have permission to delete it.");
            
            _context.Cars.Remove(car);
            _context.SaveChanges();
            
            return Ok("Car deleted successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("all")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult GetAllCars()
    {
        try
        {
            var cars = _context.Cars.Include(c => c.User).ToList();
            
            // Eltávolítjuk a referencia hurkokat a JSON szerializáláskor
            var carsWithoutCycles = cars.Select(c => new
            {
                c.Id,
                c.Brand,
                c.Model,
                c.Year,
                c.LicensePlate,
                c.UserId,
                c.IsParked,
                UserName = c.User != null ? $"{c.User.FirstName} {c.User.LastName}" : "Unknown",
                UserEmail = c.User != null ? c.User.Email : "Unknown"
            }).ToList();
            
            return Ok(carsWithoutCycles);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Belső szerverhiba: {ex.Message}");
        }
    }
} 