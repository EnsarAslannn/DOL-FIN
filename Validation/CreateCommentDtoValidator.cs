using api.Dtos.Comment;
using FluentValidation;

namespace api.Validation
{
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage("Title is required")
                .Length(5, 280)
                .WithMessage("Title must be between 5 and 280 characters");

            RuleFor(x => x.Content)
                .NotEmpty()
                .WithMessage("Content is required")
                .Length(5, 280)
                .WithMessage("Content must be between 5 and 280 characters");
        }
    }
}
