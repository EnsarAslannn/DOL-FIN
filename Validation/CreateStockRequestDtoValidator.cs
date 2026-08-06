using api.Dtos.Stock;
using FluentValidation;

namespace api.Validation
{
    public class CreateStockRequestDtoValidator : AbstractValidator<CreateStockRequestDto>
    {
        public CreateStockRequestDtoValidator()
        {
            RuleFor(x => x.Symbol)
                .NotEmpty()
                .WithMessage("Symbol is required")
                .MaximumLength(10)
                .WithMessage("Symbol must be at most 10 characters")
                .Matches("^[A-Za-z0-9.]+$")
                .WithMessage("Symbol may only contain letters, digits, and a dot");

            RuleFor(x => x.CompanyName)
                .NotEmpty()
                .WithMessage("Company name is required")
                .MaximumLength(100)
                .WithMessage("Company name must be at most 100 characters");

            RuleFor(x => x.Purchase)
                .InclusiveBetween(1, 1_000_000_000)
                .WithMessage("Purchase price must be between 1 and 1,000,000,000");

            RuleFor(x => x.LastDiv)
                .InclusiveBetween(0.001m, 100)
                .WithMessage("Last dividend must be between 0.001 and 100");

            RuleFor(x => x.Industry)
                .NotEmpty()
                .WithMessage("Industry is required")
                .MaximumLength(50)
                .WithMessage("Industry must be at most 50 characters");

            RuleFor(x => x.MarketCap)
                .InclusiveBetween(1, 50_000_000_000_000)
                .WithMessage("Market cap must be between 1 and 50,000,000,000,000");
        }
    }
}
