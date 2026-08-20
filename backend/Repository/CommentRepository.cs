using api.Data;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDBContext _context;

        public CommentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Comment> CreateAsync(Comment commentModel)
        {
            await _context.Comments.AddAsync(commentModel);
            await _context.SaveChangesAsync();
            return commentModel;
        }

        public async Task<Comment?> DeleteAsync(int id)
        {
            var commentModel = await _context.Comments.FirstOrDefaultAsync(x => x.Id == id);

            if (commentModel == null)
            {
                return null;
            }

            _context.Comments.Remove(commentModel);
            await _context.SaveChangesAsync();
            return commentModel;
        }

        public async Task<Comment?> GetByIdAsync(int id)
        {
            return await _context
                .Comments.Include(a => a.AppUser)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Comment>> GettAllAsync(CommentQueryObject queryObject)
        {
            var comments = _context.Comments.Include(a => a.AppUser).AsQueryable();

            if (!string.IsNullOrWhiteSpace(queryObject.Symbol))
            {
                comments = comments.Where(s =>
                    s.Stock != null && s.Stock.Symbol == queryObject.Symbol
                );
            }

            comments = queryObject.IsDescending
                ? comments.OrderByDescending(c => c.CreatedOn)
                : comments.OrderBy(c => c.CreatedOn);

            var skipNumber = (queryObject.PageNumber - 1) * queryObject.PageSize;

            return await comments.Skip(skipNumber).Take(queryObject.PageSize).ToListAsync();
        }

        public async Task<Comment?> UpdateAsync(int id, Comment commentModel)
        {
            var existingCommemt = await _context.Comments.FindAsync(id);

            if (existingCommemt == null)
            {
                return null;
            }

            existingCommemt.Title = commentModel.Title;
            existingCommemt.Content = commentModel.Content;

            await _context.SaveChangesAsync();

            return existingCommemt;
        }
    }
}
